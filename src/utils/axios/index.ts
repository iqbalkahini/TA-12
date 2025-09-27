"use client"

import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';

// Kunci enkripsi untuk token (dalam production, sebaiknya dari environment variable)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Fungsi untuk mengenkripsi data
const encryptData = (data: string): string => {
  if (!data) {
    throw new Error('Data tidak boleh kosong untuk enkripsi');
  }
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY tidak tersedia');
  }
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error saat enkripsi data:', error);
    throw new Error('Gagal mengenkripsi data');
  }
};

// Fungsi untuk mendekripsi data
const decryptData = (encryptedData: string): string | null => {
  if (!encryptedData) {
    return null;
  }
  if (!ENCRYPTION_KEY) {
    console.error('ENCRYPTION_KEY tidak tersedia untuk dekripsi');
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('Error saat dekripsi data:', error);
    // Jika dekripsi gagal, return null
    return null;
  }
};

// Membuat instance axios dengan konfigurasi dasar
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // Timeout 10 detik
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface untuk item dalam antrian request yang gagal
interface QueueItem {
  resolve: (value?: string | null) => void;
  reject: (error?: Error) => void;
}

// Variabel untuk menyimpan status refresh token agar tidak terjadi multiple refresh bersamaan
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Fungsi untuk memproses antrian request yang gagal saat refresh token
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Fungsi untuk mendapatkan access token dari localStorage (terenkripsi)
const getAccessToken = (): string | null => {
  const encryptedToken = localStorage.getItem('accessToken');
  if (!encryptedToken) return null;
  
  // Dekripsi token sebelum digunakan
  return decryptData(encryptedToken);
};

// Fungsi untuk mendapatkan refresh token dari localStorage (terenkripsi)
const getRefreshToken = (): string | null => {
  const encryptedToken = localStorage.getItem('refreshToken');
  if (!encryptedToken) return null;
  
  // Dekripsi token sebelum digunakan
  return decryptData(encryptedToken);
};

// Fungsi untuk menyimpan kedua token ke localStorage dalam bentuk terenkripsi
const setTokens = (accessToken: string, refreshToken: string) => {
  try {
    if (!accessToken || !refreshToken) {
      throw new Error('Access token dan refresh token harus tersedia');
    }
    
    // Enkripsi kedua token sebelum disimpan
    const encryptedAccessToken = encryptData(accessToken);
    const encryptedRefreshToken = encryptData(refreshToken);
    
    localStorage.setItem('accessToken', encryptedAccessToken);
    localStorage.setItem('refreshToken', encryptedRefreshToken);
    
    console.log('✅ Token berhasil disimpan ke localStorage');
  } catch (error) {
    console.error('❌ Error saat menyimpan token:', error);
    throw error; // Re-throw error agar bisa ditangani di level atas
  }
};

// Fungsi untuk menghapus kedua token dari localStorage
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Fungsi untuk refresh access token menggunakan refresh token terenkripsi
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Refresh token tidak tersedia');
  }

  try {
    // Melakukan request untuk mendapatkan access token baru
    const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, {
      refreshToken: refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Menyimpan kedua token baru ke localStorage (terenkripsi)
    setTokens(accessToken, newRefreshToken);
    
    return accessToken;
  } catch (error) {
    // Jika refresh token juga expired, hapus semua token
    clearTokens();
    throw error;
  }
};

// Interceptor untuk request (permintaan) - menambahkan access token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    // Mengambil access token dari localStorage
    const accessToken = getAccessToken();
    
    // Jika access token tersedia, tambahkan ke header Authorization
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response (tanggapan) - menangani token expired dan refresh otomatis
axiosInstance.interceptors.response.use(
  (response) => {
    // Jika response berhasil, langsung return response
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Jika error 401 (Unauthorized) dan belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jika sedang dalam proses refresh, tambahkan request ke antrian
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // Setelah refresh selesai, ulangi request dengan token baru
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // Tandai bahwa request ini sudah pernah di-retry
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Coba refresh access token
        const newAccessToken = await refreshAccessToken();
        
        // Proses semua request yang ada di antrian dengan token baru
        processQueue(null, newAccessToken);
        
        // Update header Authorization dengan token baru
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        // Ulangi request original dengan token baru
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Jika refresh token juga gagal, proses antrian dengan error
        const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
        processQueue(error, null);
        
        // Hapus semua token dan redirect ke login
        clearTokens();
        
        // Di sini Anda bisa menambahkan logic untuk redirect ke halaman login
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        // Reset status refreshing
        isRefreshing = false;
      }
    }

    // Untuk error lainnya, langsung reject
    return Promise.reject(error);
  }
);

// Export fungsi-fungsi utility untuk digunakan di komponen lain
export { setTokens, clearTokens, getAccessToken, getRefreshToken };
export default axiosInstance;
