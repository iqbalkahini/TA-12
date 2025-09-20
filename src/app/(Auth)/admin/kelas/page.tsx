'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { Kelas } from "@/types/api"

export default function KelasManagement() {
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    try {
      setLoading(true)
      const response = await apiService.getKelas({ limit: 100 })
      setKelas(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load kelas data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
  }

  const handleAdd = () => {
    // TODO: Implement add kelas modal/form
    console.log('Add kelas')
  }

  const handleEdit = (row: Kelas) => {
    // TODO: Implement edit kelas modal/form
    console.log('Edit kelas:', row)
  }

  const handleDelete = async (row: Kelas) => {
    if (confirm(`Are you sure you want to delete ${row.nama}?`)) {
      try {
        await apiService.delete(`/api/kelas/${row.id}`)
        loadKelas() // Refresh the list
      } catch (err) {
        console.error('Failed to delete kelas:', err)
        alert('Failed to delete kelas')
      }
    }
  }

  const handleView = (row: Kelas) => {
    // TODO: Implement view kelas details
    console.log('View kelas:', row)
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
      label: 'Created At',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'updated_at',
      label: 'Updated At',
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
          <h1 className="text-3xl font-bold text-gray-900">Kelas Management</h1>
          <p className="text-gray-600">Manage classes and their assignments</p>
        </div>

        <DataTable
          data={kelas}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search by nama kelas or jurusan..."
          title="Kelas List"
          addButtonText="Add New Kelas"
        />
      </div>
    </AdminLayout>
  )
}
