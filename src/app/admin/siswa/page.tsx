'use client'

import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import type { Siswa, Kelas, Jurusan } from "@/types/api"
import { deleteSiswa, getSiswa } from "@/api/admin/siswa/index"
import { getKelas } from "@/api/admin/kelas/index"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDate } from "@/utils/date"
import { getJurusan } from "@/api/admin/jurusan"

export default function SiswaManagement() {
  const router = useRouter()
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedKelas, setSelectedKelas] = useState<number>(0)
  const [selectedJurusan, setSelectedJurusan] = useState<number>(0)

  const filterData = {
    kelas: kelas,
    jurusan: jurusan,
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (search?: string, page: number = 1, isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      // Load both siswa and kelas data in parallel
      const [siswaResponse, kelasResponse, jurusanResponse] = await Promise.all([
        getSiswa(search, page, selectedKelas, selectedJurusan),
        getKelas(),
        getJurusan()
      ])

      const siswaData = siswaResponse?.data?.data || []
      const totalAll = siswaResponse?.data?.total_all || 0

      // Calculate total pages (10 items per page)
      const calculatedTotalPages = Math.ceil(totalAll / 10)
      setTotalPages(calculatedTotalPages)
      setCurrentPage(page)

      // Sort siswa by nama_lengkap (ascending)
      const sortedSiswa = [...siswaData].sort((a, b) => {
        const nameA = (a.nama_lengkap || '').toLowerCase()
        const nameB = (b.nama_lengkap || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })

      setSiswa(sortedSiswa)
      setKelas(kelasResponse?.data?.data || [])
      setJurusan(jurusanResponse?.data?.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
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
    loadData(search, 1, true)
  }

  const handlePageChange = (page: number) => {
    loadData(searchTerm, page, true)
  }

  const handleAdd = () => {
    router.push('/admin/siswa/buat')
  }

  const handleEdit = (row: Siswa) => {
    router.push(`/admin/siswa/edit/${row.id}`)
  }

  const handleDelete = async (row: Siswa) => {
    try {
      await deleteSiswa(row.id)
      toast.success(`Data siswa ${row.nama_lengkap} berhasil dihapus`)
      loadData(searchTerm, currentPage, !!searchTerm) // Refresh the list
    } catch (err) {
      console.error('Failed to delete siswa:', err)
      toast.error('Gagal menghapus data siswa')
    }
  }

  const handleView = (row: Siswa) => {
    router.push(`/admin/siswa/${row.id}`)
  }

  // Helper function to get kelas name by id
  const getKelasName = (kelasId: number) => {
    const kelasItem = kelas.find(k => k.id === kelasId)
    return kelasItem ? kelasItem.nama : `Kelas ID: ${kelasId}`
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
      label: 'Kelas',
      sortable: true,
      render: (value: unknown) => {
        const kelasId = value as number
        const kelasName = getKelasName(kelasId)
        return (
          <>
            {kelasName}
          </>
        )
      },
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadData(searchTerm)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Siswa</h1>
        <p className="text-gray-600">Kelola data siswa dan informasi pribadi</p>
      </div>

      <DataTable
        data={siswa}
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
        title="Daftar Siswa"
        addButtonText="Tambah Siswa Baru"
        filter={true}
        filterData={filterData}
        setSelectedKelas={setSelectedKelas}
        setSelectedJurusan={setSelectedJurusan}
        selectedKelas={selectedKelas}
        selectedJurusan={selectedJurusan}
        loadData={loadData}
        loading={loading}
      />
    </div>
  )
}
