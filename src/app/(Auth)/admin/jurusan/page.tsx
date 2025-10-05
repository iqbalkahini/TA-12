'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import type { Jurusan } from "@/types/api"
import { useRouter } from "next/navigation"
import { getJurusan, deleteJurusan } from "@/api/admin/jurusan"
import { toast } from "sonner"
import { formatDate } from "@/utils/date"

export default function JurusanManagement() {
  const router = useRouter()
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadJurusan()
  }, [])

  const loadJurusan = async () => {
    try {
      setLoading(true)
      const response = await getJurusan()
      setJurusan(response.data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jurusan data')
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
    router.push('/admin/jurusan/buat')
  }

  const handleEdit = (row: Jurusan) => {
    router.push(`/admin/jurusan/edit/${row.id}`)
  }

  const handleDelete = async (row: Jurusan) => {
    try {
      await deleteJurusan(row.id)
      toast.success(`Data jurusan ${row.nama} berhasil dihapus`)
      loadJurusan() // Refresh the list
    } catch (err) {
      console.error('Failed to delete jurusan:', err)
      toast.error('Gagal menghapus data jurusan')
    }
  }

  const handleView = (row: Jurusan) => {
    router.push(`/admin/jurusan/${row.id}`)
  }


  const columns = [
    {
      key: 'kode',
      label: 'Kode',
      sortable: true,
    },
    {
      key: 'nama',
      label: 'Nama Jurusan',
      sortable: true,
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
            <p className="mt-2 text-gray-600">Loading jurusan data...</p>
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
            <Button onClick={loadJurusan}>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Jurusan</h1>
          <p className="text-gray-600">Kelola program studi dan departemen</p>
        </div>

        <DataTable
          data={jurusan}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Cari berdasarkan kode atau nama..."
          title="Daftar Jurusan"
          addButtonText="Tambah Jurusan Baru"
        />
      </div>
    </AdminLayout>
  )
}
