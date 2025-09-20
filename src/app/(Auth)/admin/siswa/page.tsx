'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import type { Siswa } from "@/types/api"

export default function SiswaManagement() {
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSiswa()
  }, [])

  const loadSiswa = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSiswa({ limit: 100 })
      setSiswa(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load siswa data')
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
    // TODO: Implement add siswa modal/form
    console.log('Add siswa')
  }

  const handleEdit = (row: Siswa) => {
    // TODO: Implement edit siswa modal/form
    console.log('Edit siswa:', row)
  }

  const handleDelete = async (row: Siswa) => {
    if (confirm(`Are you sure you want to delete ${row.nama_lengkap}?`)) {
      try {
        await apiService.delete(`/api/siswa/${row.id}`)
        loadSiswa() // Refresh the list
      } catch (err) {
        console.error('Failed to delete siswa:', err)
        alert('Failed to delete siswa')
      }
    }
  }

  const handleView = (row: Siswa) => {
    // TODO: Implement view siswa details
    console.log('View siswa:', row)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID')
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
      label: 'Kelas ID',
      sortable: true,
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
            <Button onClick={loadSiswa}>
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
          <h1 className="text-3xl font-bold text-gray-900">Siswa Management</h1>
          <p className="text-gray-600">Manage student accounts and information</p>
        </div>

        <DataTable
          data={siswa}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search by name, NISN, or class..."
          title="Siswa List"
          addButtonText="Add New Siswa"
        />
      </div>
    </AdminLayout>
  )
}
