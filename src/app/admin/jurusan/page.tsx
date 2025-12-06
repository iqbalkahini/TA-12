'use client'

import { useEffect, useState } from "react"

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
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadJurusan()
  }, [])

  const loadJurusan = async (search?: string, page: number = 1, isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      const response = await getJurusan(search, page)
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

      setJurusan(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jurusan data')
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
    loadJurusan(search, 1, true)
  }

  const handlePageChange = (page: number) => {
    loadJurusan(searchTerm, page, true)
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
      loadJurusan(searchTerm, currentPage, !!searchTerm) // Refresh the list
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading jurusan data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadJurusan(searchTerm)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
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
        onSearch={handleSearch}
        isSearching={searchLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchPlaceholder="Cari berdasarkan nama..."
        title="Daftar Jurusan"
        addButtonText="Tambah Jurusan Baru"
      />
    </div>
  )
}
