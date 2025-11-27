// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

// Dashboard Types
export interface DashboardStats {
  total_users: number
  total_guru: number
  total_siswa: number
  total_jurusan: number
  total_kelas: number
  total_industri: number
  admin_users: number
  guru_users: number
  siswa_users: number
  last_updated: string
}

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  expires_at: string
  user: {
    id: number
    username: string
    role: string
    is_active: boolean
  }
}

export interface GuruLoginRequest {
  kode_guru: string
  password: string
}

export interface GuruLoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  expires_at: string
  user: {
    id: number
    kode_guru: string
    nama: string
    role: string
    is_active: boolean
    is_koordinator: boolean
    is_pembimbing: boolean
    is_wali_kelas: boolean
    is_kaprog: boolean
  }
}

export interface SiswaLoginRequest {
  nama_lengkap: string
  nisn: string
}

// Entity Types
export interface Guru {
  id: number
  user_id: number
  kode_guru: string
  nip: string
  nama: string
  no_telp?: string
  is_koordinator: boolean
  is_pembimbing: boolean
  is_wali_kelas: boolean
  is_kaprog: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Siswa {
  id: number
  nama_lengkap: string
  nisn: string
  kelas_id: number
  alamat?: string
  no_telp?: string
  tanggal_lahir?: string
  created_at: string
  updated_at: string
}

export interface Jurusan {
  id: number
  kode: string
  nama: string
  created_at: string
  updated_at: string
}

export interface Kelas {
  id: number
  jurusan_id: number
  nama: string
  created_at: string
  updated_at: string
}

export interface Industri {
  id: number
  jurusan_id: number
  nama: string
  alamat: string
  bidang?: string
  email?: string
  no_telp?: string
  pic?: string
  pic_telp?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// List Response Types
export interface ListResponse<T> {
  data: T[]
  total_all: number
  total_this_pagination: number
}

export type GuruListResponse = ListResponse<Guru>
export type SiswaListResponse = ListResponse<Siswa>
export type JurusanListResponse = ListResponse<Jurusan>
export type KelasListResponse = ListResponse<Kelas>
export type IndustriListResponse = ListResponse<Industri>
