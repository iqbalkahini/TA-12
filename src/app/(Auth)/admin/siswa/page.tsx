'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import type { Siswa, Kelas } from "@/types/api"
import { deleteSiswa, getSiswa } from "@/api/admin/siswa/index"
import { getKelas } from "@/api/admin/kelas/index"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDate } from "@/utils/date"

export default function SiswaManagement() {
  const router = useRouter()
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Load both siswa and kelas data in parallel
      const [siswaResponse, kelasResponse] = await Promise.all([
        getSiswa(),
        getKelas()
      ])

      setSiswa(siswaResponse?.data?.data || [])
      setKelas(kelasResponse?.data?.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }

  const handleAdd = () => {
    router.push('/admin/siswa/buat')
  }

  const handleEdit = (row: Siswa) => {
    router.push(`/admin/siswa/edit/${row.id}`)
  }

  const handleDelete = async (row: Siswa) => {
    try {
      await deleteSiswa(row.id)
      toast.success(`Data siswa ${row.nama_lengkap} berhasil dihapus`)
      loadData() // Refresh the list
    } catch (err) {
      console.error('Failed to delete siswa:', err)
      toast.error('Gagal menghapus data siswa')
    }
  }

  const handleView = (row: Siswa) => {
    router.push(`/admin/siswa/${row.id}`)
  }

  // Helper function to get kelas name by id
  const getKelasName = (kelasId: number) => {
    const kelasItem = kelas.find(k => k.id === kelasId)
    return kelasItem ? kelasItem.nama : `Kelas ID: ${kelasId}`
  }

  const columns = [
    {
      key: 'nisn',
      label: 'NISN',
      sortable: true,
    },
    {
      key: 'nama_lengkap',
      label: 'Nama Lengkap',
      sortable: true,
    },
    {
      key: 'kelas_id',
      label: 'Kelas',
      sortable: true,
      render: (value: unknown) => {
        const kelasId = value as number
        const kelasName = getKelasName(kelasId)
        return (
          <>
            {kelasName}
          </>
        )
      },
    },
    {
      key: 'no_telp',
      label: 'No. Telp',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'tanggal_lahir',
      label: 'Tanggal Lahir',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'alamat',
      label: 'Alamat',
      render: (value: unknown) => {
        const str = value as string
        return str ? (str.length > 30 ? str.substring(0, 30) + '...' : str) : '-'
      },
    },
  ]

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading siswa data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadData}>
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Siswa</h1>
          <p className="text-gray-600">Kelola data siswa dan informasi pribadi</p>
        </div>

        <DataTable
          data={siswa}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Cari berdasarkan nama, NISN, atau kelas..."
          title="Daftar Siswa"
          addButtonText="Tambah Siswa Baru"
        />
      </div>
    </AdminLayout>
  )
}
