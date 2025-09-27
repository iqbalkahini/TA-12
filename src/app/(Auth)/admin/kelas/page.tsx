'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Kelas } from "@/types/api"
import { deleteKelas, getKelas } from "@/api/admin/kelas/index"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function KelasManagement() {
  const router = useRouter()
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    try {
      setLoading(true)
      const response = await getKelas()
      setKelas(response.data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load kelas data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // await apiService.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
    }
  }

  const handleAdd = () => {
    router.push('/admin/kelas/buat')
  }

  const handleEdit = (row: Kelas) => {
    router.push(`/admin/kelas/edit/${row.id}`)
  }

  const handleDelete = async (row: Kelas) => {
    try {
      await deleteKelas(row.id)
      toast.success(`Data kelas ${row.nama} berhasil dihapus`)
      loadKelas() // Refresh the list
    } catch (err) {
      console.error('Failed to delete kelas:', err)
      toast.error('Gagal menghapus data kelas')
    }
  }

  const handleView = (row: Kelas) => {
    router.push(`/admin/kelas/${row.id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  const columns = [
    {
      key: 'nama',
      label: 'Nama Kelas',
      sortable: true,
    },
    {
      key: 'jurusan_id',
      label: 'Jurusan ID',
      sortable: true,
      render: (value: unknown) => (
        <Badge variant="outline">Jurusan {value as number}</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Dibuat Pada',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'updated_at',
      label: 'Diperbarui',
      render: (value: unknown) => formatDate(value as string),
    },
  ]

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading kelas data...</p>
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
            <Button onClick={loadKelas}>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kelas</h1>
          <p className="text-gray-600">Kelola kelas dan penugasannya</p>
        </div>

        <DataTable
          data={kelas}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Cari berdasarkan nama kelas atau jurusan..."
          title="Daftar Kelas"
          addButtonText="Tambah Kelas Baru"
        />
      </div>
    </AdminLayout>
  )
}
