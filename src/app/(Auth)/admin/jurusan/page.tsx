'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { Jurusan } from "@/types/api"

export default function JurusanManagement() {
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadJurusan()
  }, [])

  const loadJurusan = async () => {
    try {
      setLoading(true)
      const response = await apiService.getJurusan({ limit: 100 })
      setJurusan(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jurusan data')
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
    // TODO: Implement add jurusan modal/form
    console.log('Add jurusan')
  }

  const handleEdit = (row: Jurusan) => {
    // TODO: Implement edit jurusan modal/form
    console.log('Edit jurusan:', row)
  }

  const handleDelete = async (row: Jurusan) => {
    if (confirm(`Are you sure you want to delete ${row.nama}?`)) {
      try {
        await apiService.delete(`/api/jurusan/${row.id}`)
        loadJurusan() // Refresh the list
      } catch (err) {
        console.error('Failed to delete jurusan:', err)
        alert('Failed to delete jurusan')
      }
    }
  }

  const handleView = (row: Jurusan) => {
    // TODO: Implement view jurusan details
    console.log('View jurusan:', row)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
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
          <h1 className="text-3xl font-bold text-gray-900">Jurusan Management</h1>
          <p className="text-gray-600">Manage study programs and departments</p>
        </div>

        <DataTable
          data={jurusan}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search by kode or nama..."
          title="Jurusan List"
          addButtonText="Add New Jurusan"
        />
      </div>
    </AdminLayout>
  )
}
