import type { Guru } from "@/types/api"

export interface GuruRoleData {
  is_koordinator?: boolean
  is_pembimbing?: boolean
  is_wali_kelas?: boolean
  is_kaprog?: boolean
}

// Fungsi untuk mendapatkan primary role berdasarkan prioritas
export const getPrimaryGuruRole = (guruData: GuruRoleData): string => {
  // Prioritas: Kaprog > Koordinator > Wali Kelas > Pembimbing
  if (guruData.is_kaprog) return 'kapro'
  if (guruData.is_koordinator) return 'koordinator'
  if (guruData.is_wali_kelas) return 'wali-kelas'
  if (guruData.is_pembimbing) return 'pembimbing'
  return 'pembimbing' // Default fallback
}

// Fungsi untuk mendapatkan default path berdasarkan guru role
export const getGuruDefaultPath = (guruData: GuruRoleData): string => {
  const primaryRole = getPrimaryGuruRole(guruData)
  return `/${primaryRole}/dashboard`
}

// Fungsi untuk mendapatkan semua role yang dimiliki guru
export const getGuruRoles = (guruData: GuruRoleData): Array<{
  key: string
  label: string
  path: string
}> => {
  const roles: Array<{ key: string; label: string; path: string }> = []
  
  if (guruData.is_kaprog) {
    roles.push({ key: 'kapro', label: 'Kepala Program', path: '/kapro/dashboard' })
  }
  if (guruData.is_koordinator) {
    roles.push({ key: 'koordinator', label: 'Koordinator', path: '/koordinator/dashboard' })
  }
  if (guruData.is_wali_kelas) {
    roles.push({ key: 'wali-kelas', label: 'Wali Kelas', path: '/wali-kelas/dashboard' })
  }
  if (guruData.is_pembimbing) {
    roles.push({ key: 'pembimbing', label: 'Pembimbing', path: '/pembimbing/dashboard' })
  }
  
  return roles
}

// Fungsi untuk cek apakah guru punya multiple roles
export const hasMultipleRoles = (guruData: GuruRoleData): boolean => {
  const roleCount = [
    guruData.is_kaprog,
    guruData.is_koordinator,
    guruData.is_wali_kelas,
    guruData.is_pembimbing
  ].filter(Boolean).length
  
  return roleCount > 1
}
