'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Guru } from "@/types/api"
import { deleteGuru, getGuru } from "@/api/admin/guru"
import { useRouter } from "next/navigation"

export default function GuruManagement() {
  const router = useRouter()
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadGuru()
  }, [])

  const loadGuru = async (search?: string, page: number = 1, isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      const response = await getGuru(search, page)
      const data = response.data.data || []
      const totalAll = response.data.total_all || 0

      // Calculate total pages (10 items per page)
      const calculatedTotalPages = Math.ceil(totalAll / 10)
      setTotalPages(calculatedTotalPages)
      setCurrentPage(page)

      // Sort data by name (ascending)
      const sortedData = [...data].sort((a, b) => {
        const nameA = (a.nama || '').toLowerCase()
        const nameB = (b.nama || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })

      setGuru(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guru data')
    } finally {
      if (isSearch) {
        setSearchLoading(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleSearch = (search: string) => {
    setSearchTerm(search)
    setCurrentPage(1)
    loadGuru(search, 1, true)
  }

  const handlePageChange = (page: number) => {
    loadGuru(searchTerm, page, true)
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
    router.push('/admin/guru/buat')
  }

  const handleEdit = (row: Guru) => {
    router.push(`/admin/guru/edit/${row.id}`)
  }

  const handleDelete = async (row: Guru) => {
    try {
      await deleteGuru(row.id)
      loadGuru(searchTerm, currentPage, !!searchTerm) // Refresh the list
    } catch (err) {
      console.error('Failed to delete guru:', err)
      alert('Failed to delete guru')
    }
  }

  const handleView = (row: Guru) => {
    router.push(`/admin/guru/${row.id}`)
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
      <AdminLayout>
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => loadGuru(searchTerm)}>
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
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
          onSearch={handleSearch}
          isSearching={searchLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchPlaceholder="Cari berdasarkan nama..."
          title="Guru List"
          addButtonText="Add New Guru"
        />
      </div>
    </AdminLayout>
  )
}
