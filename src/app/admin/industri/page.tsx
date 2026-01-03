'use client'

import { useEffect, useState } from "react"

import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Industri } from "@/types/api"
import { deleteIndustri, getIndustri } from "@/api/admin/industri"
import { getJurusan } from "@/api/admin/jurusan"
import type { Jurusan } from "@/types/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function IndustriManagement() {
  const router = useRouter()
  const [industri, setIndustri] = useState<Industri[]>([])
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedJurusan, setSelectedJurusan] = useState<number>()

  const filterData = {
    jurusan: jurusan
  }

  useEffect(() => {
    loadIndustri()
  }, [])

  const loadIndustri = async (search?: string, page: number = 1, isSearch = false) => {
    if (isSearch) {
      setSearchLoading(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      // Load both industri and jurusan data in parallel
      const [industriResponse, jurusanResponse] = await Promise.all([
        getIndustri(search, page, selectedJurusan),
        getJurusan()
      ])

      if (industriResponse && industriResponse.data) {
        const industriData = industriResponse.data.data || []
        const totalAll = industriResponse.data.total_all || 0

        // Calculate total pages (10 items per page)
        const calculatedTotalPages = Math.ceil(totalAll / 10)
        setTotalPages(calculatedTotalPages)
        setCurrentPage(page)

        // Sort industri by name (ascending)
        const sortedIndustri = [...industriData].sort((a, b) => {
          const nameA = (a.nama || '').toLowerCase()
          const nameB = (b.nama || '').toLowerCase()
          return nameA.localeCompare(nameB)
        })

        setIndustri(sortedIndustri)
      } else {
        setError('Failed to load industri data')
      }

      if (jurusanResponse && jurusanResponse.data) {
        const jurusanData = jurusanResponse.data.data || []
        setJurusan(jurusanData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load industri data')
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
    loadIndustri(search, 1, true)
  }

  const handlePageChange = (page: number) => {
    loadIndustri(searchTerm, page, true)
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
      loadIndustri(searchTerm, currentPage, !!searchTerm) // Refresh the list
    } catch (err) {
      console.error('Failed to delete industri:', err)
      toast.error('Gagal menghapus data industri')
    }
  }

  const handleView = (row: Industri) => {
    router.push(`/admin/industri/${row.id}`)
  }

  // Helper function to get jurusan name by id
  const getJurusanName = (jurusanId: number) => {
    const jurusanItem = jurusan.find(j => j.id === jurusanId)
    const result = jurusanItem ? jurusanItem.nama : `Jurusan ID: ${jurusanId}`
    return result
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
      label: 'Jurusan',
      sortable: true,
      render: (value: unknown) => {
        const jurusanId = value as number
        const jurusanName = getJurusanName(jurusanId)
        return <Badge variant="outline">{jurusanName}</Badge>
      },
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading industri data...</p>
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
          <Button onClick={() => loadIndustri(searchTerm)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
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
        onSearch={handleSearch}
        isSearching={searchLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchPlaceholder="Cari berdasarkan nama..."
        title="Daftar Industri"
        addButtonText="Tambah Industri Baru"
        filter={true}
        filterData={filterData}
        setSelectedJurusan={setSelectedJurusan}
        selectedJurusan={selectedJurusan}
        loadData={() => loadIndustri(searchTerm, currentPage)}
        loading={loading}
      />
    </div>
  )
}
