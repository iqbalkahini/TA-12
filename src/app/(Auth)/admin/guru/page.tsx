'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { Guru } from "@/types/api"

export default function GuruManagement() {
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGuru()
  }, [])

  const loadGuru = async () => {
    try {
      setLoading(true)
      const response = await apiService.getGuru({ limit: 100 })
      setGuru(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guru data')
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
    // TODO: Implement add guru modal/form
    console.log('Add guru')
  }

  const handleEdit = (row: Guru) => {
    // TODO: Implement edit guru modal/form
    console.log('Edit guru:', row)
  }

  const handleDelete = async (row: Guru) => {
    if (confirm(`Are you sure you want to delete ${row.nama}?`)) {
      try {
        await apiService.delete(`/api/guru/${row.id}`)
        loadGuru() // Refresh the list
      } catch (err) {
        console.error('Failed to delete guru:', err)
        alert('Failed to delete guru')
      }
    }
  }

  const handleView = (row: Guru) => {
    // TODO: Implement view guru details
    console.log('View guru:', row)
  }

  const columns = [
    {
      key: 'kode_guru',
      label: 'Kode Guru',
      sortable: true,
    },
    {
      key: 'nama',
      label: 'Nama',
      sortable: true,
    },
    {
      key: 'nip',
      label: 'NIP',
      sortable: true,
    },
    {
      key: 'no_telp',
      label: 'No. Telp',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (value: unknown, row: Guru) => (
        <div className="flex flex-wrap gap-1">
          {row.is_koordinator && <Badge variant="default" className="text-xs">Koordinator</Badge>}
          {row.is_pembimbing && <Badge variant="success" className="text-xs">Pembimbing</Badge>}
          {row.is_wali_kelas && <Badge variant="warning" className="text-xs">Wali Kelas</Badge>}
          {row.is_kaprog && <Badge variant="destructive" className="text-xs">Kaprog</Badge>}
        </div>
      ),
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
            <p className="mt-2 text-gray-600">Loading guru data...</p>
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
            <Button onClick={loadGuru}>
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
          <h1 className="text-3xl font-bold text-gray-900">Guru Management</h1>
          <p className="text-gray-600">Manage teacher accounts and information</p>
        </div>

        <DataTable
          data={guru}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search by name, kode guru, or NIP..."
          title="Guru List"
          addButtonText="Add New Guru"
        />
      </div>
    </AdminLayout>
  )
}
