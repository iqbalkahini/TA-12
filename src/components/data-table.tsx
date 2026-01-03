'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Plus, Edit, Trash2, Eye, AlertTriangle, Filter, ChevronsUpDown, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Jurusan, Siswa, Kelas } from "@/types/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"

interface Column<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface FilterData {
  siswa?: Siswa[]
  jurusan?: Jurusan[]
  kelas?: Kelas[]
}

interface DataTableProps<T = Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  onAdd?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onSearch?: (searchTerm: string) => void
  searchPlaceholder?: string
  title?: string
  addButtonText?: string
  isSearching?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  filterData?: FilterData
  filter?: boolean
  setSelectedKelas?: (kelasId: number) => void
  setSelectedJurusan?: (jurusanId: number) => void
  selectedKelas?: number
  selectedJurusan?: number
  loadData?: () => void
  loading?: boolean
}

export function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onSearch,
  searchPlaceholder = "Search...",
  title,
  addButtonText = "Add New",
  isSearching = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  filterData = {},
  filter = false,
  setSelectedKelas,
  setSelectedJurusan,
  selectedKelas,
  selectedJurusan,
  loadData,
  loading,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSearchTerm, setActiveSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  // Handle search action
  const handleSearch = () => {
    if (onSearch) {
      setActiveSearchTerm(searchTerm)
      onSearch(searchTerm)
    }
  }

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Client-side filtering only if onSearch is not provided
  const filteredData = onSearch
    ? data
    : data.filter((row) =>
      Object.values(row as Record<string, unknown>).some((value) =>
        String(value).toLowerCase().includes(activeSearchTerm.toLowerCase())
      )
    )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = (a as Record<string, unknown>)[sortConfig.key]
    const bValue = (b as Record<string, unknown>)[sortConfig.key]

    const aStr = String(aValue || '')
    const bStr = String(bValue || '')

    if (aStr < bStr) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aStr > bStr) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const renderCell = (column: Column<T>, row: T) => {
    if (column.render) {
      return column.render((row as Record<string, unknown>)[column.key], row)
    }
    return String((row as Record<string, unknown>)[column.key] || '')
  }

  const handleDelete = (row: T) => {
    setItemToDelete(row)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (onDelete && itemToDelete) {
      onDelete(itemToDelete)
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Helper function to get display name for the item
  const getItemDisplayName = (item: T): string => {
    const record = item as Record<string, unknown>
    // Try common name fields
    return String(record.nama || record.name || record.title || record.kode_guru || record.id || 'item ini')
  }

  const handleFilter = () => {
    setFilterDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-8"
          />
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            {addButtonText}
          </Button>
        )}
        {filter && (
          <Button onClick={handleFilter} className="flex items-center gap-2 cursor-pointer">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        {
          loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading siswa data...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortConfig?.key === column.key && (
                          <span className="text-xs">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="ml-3 text-gray-600">Mencari data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {renderCell(column, row)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(row)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(row)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(row)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )
        }
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber: number

                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="min-w-[40px]"
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Konfirmasi Hapus</span>
            </DialogTitle>
            <DialogDescription className="text-left">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-foreground">
                {itemToDelete ? getItemDisplayName(itemToDelete) : 'item ini'}
              </span>?
              <br />
              <span className="text-destructive font-medium">
                Tindakan ini tidak dapat dibatalkan.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={cancelDelete}
              className="mr-2"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs defaultValue={Object.keys(filterData)[0] || 'kelas'}>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-destructive" />
                <span>Filter Data</span>
              </DialogTitle>
              <DialogDescription className="text-left">
                Pilih kriteria filter di bawah ini.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <TabsList className="mb-4">
                {Object.keys(filterData).map((key) => (
                  <TabsTrigger key={key} value={key} className="capitalize">
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="kelas">
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-[200px] justify-between"
                    >
                      {
                        selectedKelas ? filterData.kelas?.find((kelas) => kelas.id === selectedKelas)?.nama : 'Pilih Kelas'
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search kelas..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No kelas found.</CommandEmpty>
                        <CommandGroup>
                          {filterData.kelas?.map((kelas) => (
                            <CommandItem key={kelas.id} value={kelas.nama} onSelect={() => {
                              if (setSelectedKelas) {
                                if (selectedKelas === kelas.id) {
                                  setSelectedKelas(0)
                                } else {
                                  setSelectedKelas(kelas.id)
                                }
                              }
                            }}>
                              {kelas.nama} {selectedKelas === kelas.id && <Check className="ml-2 h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </TabsContent>

              <TabsContent value="jurusan">
                <Popover modal={true} >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-[200px] justify-between"
                    >
                      {
                        selectedJurusan ? filterData.jurusan?.find((jurusan) => jurusan.id === selectedJurusan)?.nama : 'Pilih Jurusan'
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" >
                    <Command>
                      <CommandInput placeholder="Search jurusan..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No jurusan found.</CommandEmpty>
                        <CommandGroup>
                          {filterData.jurusan?.map((jurusan) => (
                            <CommandItem key={jurusan.id} value={`${jurusan.kode} - ${jurusan.nama}`} onSelect={() => {
                              if (setSelectedJurusan) {
                                if (selectedJurusan === jurusan.id) {
                                  setSelectedJurusan(0)
                                } else {
                                  setSelectedJurusan(jurusan.id)
                                }
                              }
                            }}>
                              {jurusan.kode} - {jurusan.nama} {selectedJurusan === jurusan.id && <Check className="ml-2 h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </TabsContent>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFilterDialogOpen(false)}
                className="mr-2"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setFilterDialogOpen(false)
                  loadData && loadData()
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
