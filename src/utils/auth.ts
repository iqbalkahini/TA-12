import { getAccessToken, clearTokens } from "./axios";

// Interface untuk user data
export interface User {
  id: string;
  kode_guru: string;
  nama: string;
  role: "adm" | "gru" | "ssw";
  is_active: boolean;
  is_kaprog: boolean;
  is_koordinator: boolean;
  is_pembimbing: boolean;
  is_wali_kelas: boolean;
}

export interface UserSiswa {
  id: number;
  is_active: boolean;
  kelas_id: number;
  nama_lengkap: string;
  role: "ssw";
  nisn?: string;
}

// Fungsi untuk mengecek apakah user sudah login
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = getAccessToken();

  if (!token) {
    return false;
  }

  try {
    // Decode JWT token untuk mengecek expiry
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Cek apakah token sudah expired
    const isValid = payload.exp > currentTime;
    if (!isValid) {
      clearTokens();
    }
    return isValid;
  } catch {
    // Jika error saat decode, hapus token dan return false
    clearTokens();
    return false;
  }
};

// Fungsi untuk mendapatkan data user dari token
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const token = getAccessToken();
  if (!token) return null;

  try {
    // Decode JWT token untuk mendapatkan user data
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Cek apakah token masih valid
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTime) {
      clearTokens();
      return null;
    }

    // Return user data dari payload
    const userData = {
      id: payload.sub || payload.id,
      kode_guru: payload.kode_guru,
      nama: payload.nama, // Add this line
      role: payload.rl || payload.role || "adm",
      is_active: payload.is_active, // Add this line
      is_kaprog: payload.is_kaprog, // Add this line
      is_koordinator: payload.is_koordinator, // Add this line
      is_pembimbing: payload.is_pembimbing, // Add this line
      is_wali_kelas: payload.is_wali_kelas, // Add this line
      username: payload.usr || payload.username,
      nama_lengkap: payload.nama_lengkap,
      nisn: payload.nisn,
      kelas_id: payload.kelas_id,
    };

    return userData;
  } catch {
    // Jika error saat decode, hapus token
    clearTokens();
    return null;
  }
};

// Fungsi untuk mendapatkan role user
export const getUserRole = (): "adm" | "gru" | "ssw" | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Fungsi untuk logout
export const logout = (): void => {
  clearTokens();
  // Redirect ke halaman login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Fungsi untuk mengecek apakah user memiliki role tertentu
export const hasRole = (requiredRole: "adm" | "gru" | "ssw"): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Fungsi untuk mengecek apakah user memiliki salah satu dari beberapa role
export const hasAnyRole = (roles: ("adm" | "gru" | "ssw")[]): boolean => {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
};

// Higher-order component untuk proteksi route
export const requireAuth = () => {
  if (typeof window === "undefined") return true; // Server-side, biarkan middleware handle

  if (!isAuthenticated()) {
    // Redirect ke login jika belum login
    const currentPath = window.location.pathname;
    window.location.href = `/login?returnUrl=${encodeURIComponent(
      currentPath
    )}`;
    return false;
  }

  return true;
};

// Higher-order component untuk proteksi berdasarkan role
export const requireRole = (requiredRole: "adm" | "gru" | "ssw") => {
  if (typeof window === "undefined") return true; // Server-side, biarkan middleware handle

  if (!isAuthenticated()) {
    const currentPath = window.location.pathname;
    window.location.href = `/login?returnUrl=${encodeURIComponent(
      currentPath
    )}`;
    return false;
  }

  if (!hasRole(requiredRole)) {
    // Redirect ke halaman tidak authorized atau dashboard sesuai role
    const userRole = getUserRole();
    if (userRole) {
      window.location.href = `/${userRole}`;
    } else {
      window.location.href = "/login";
    }
    return false;
  }

  return true;
};
