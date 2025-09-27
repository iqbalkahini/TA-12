'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Industri } from "@/types/api"
import { deleteIndustri, getIndustri } from "@/api/admin/industri"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function IndustriManagement() {
  const router = useRouter()
  const [industri, setIndustri] = useState<Industri[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIndustri()
  }, [])

  const loadIndustri = async () => {
    try {
      setLoading(true)
      const response = await getIndustri()
      setIndustri(response.data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load industri data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
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
    router.push('/admin/industri/buat')
  }

  const handleEdit = (row: Industri) => {
    router.push(`/admin/industri/edit/${row.id}`)
  }

  const handleDelete = async (row: Industri) => {
    try {
      await deleteIndustri(row.id)
      toast.success(`Data industri ${row.nama} berhasil dihapus`)
      loadIndustri() // Refresh the list
    } catch (err) {
      console.error('Failed to delete industri:', err)
      toast.error('Gagal menghapus data industri')
    }
  }

  const handleView = (row: Industri) => {
    router.push(`/admin/industri/${row.id}`)
  }


  const columns = [
    {
      key: 'nama',
      label: 'Nama Industri',
      sortable: true,
    },
    {
      key: 'alamat',
      label: 'Alamat',
      render: (value: unknown) => {
        const str = value as string
        return str.length > 30 ? str.substring(0, 30) + '...' : str
      },
    },
    {
      key: 'bidang',
      label: 'Bidang',
      render: (value: unknown) => (value as string) || '-',
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
      key: 'email',
      label: 'Email',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: unknown) => (
        <Badge variant={(value as boolean) ? 'success' : 'destructive'}>
          {(value as boolean) ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading industri data...</p>
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
            <Button onClick={loadIndustri}>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Industri</h1>
          <p className="text-gray-600">Kelola mitra industri dan penempatan kerja</p>
        </div>

        <DataTable
          data={industri}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Cari berdasarkan nama, alamat, atau bidang..."
          title="Daftar Industri"
          addButtonText="Tambah Industri Baru"
        />
      </div>
    </AdminLayout>
  )
}
