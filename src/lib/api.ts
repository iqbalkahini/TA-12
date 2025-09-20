import type {
  ApiResponse,
  DashboardStats,
  LoginRequest,
  LoginResponse,
  GuruListResponse,
  SiswaListResponse,
  JurusanListResponse,
  KelasListResponse,
  IndustriListResponse
} from '@/types/api'

const API_BASE_URL = 'http://sispkl.gedanggoreng.com:8000'

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    return this.handleResponse<LoginResponse>(response)
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    await this.handleResponse(response)
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    })
    return this.handleResponse<LoginResponse>(response)
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<ApiResponse<DashboardStats>>(response)
  }

  // Generic CRUD operations
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  // Specific entity endpoints
  async getGuru(params?: { page?: number; limit?: number; search?: string }): Promise<GuruListResponse> {
    return this.get<GuruListResponse>('/api/guru', params)
  }

  async getSiswa(params?: { page?: number; limit?: number; search?: string; kelas_id?: number; jurusan_id?: number }): Promise<SiswaListResponse> {
    return this.get<SiswaListResponse>('/api/siswa', params)
  }

  async getJurusan(params?: { page?: number; limit?: number; search?: string; name?: string }): Promise<JurusanListResponse> {
    return this.get<JurusanListResponse>('/api/jurusan', params)
  }

  async getKelas(params?: { page?: number; limit?: number; search?: string; jurusan_id?: number }): Promise<KelasListResponse> {
    return this.get<KelasListResponse>('/api/kelas', params)
  }

  async getIndustri(params?: { page?: number; limit?: number; search?: string; jurusan_id?: number; name?: string }): Promise<IndustriListResponse> {
    return this.get<IndustriListResponse>('/api/industri', params)
  }
}

export const apiService = new ApiService()
