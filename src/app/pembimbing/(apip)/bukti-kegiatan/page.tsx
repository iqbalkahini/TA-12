"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Clock,
  FileText,
  MoreVertical
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { realisasiKegiatanPkl } from "@/api/pembimbing"
import { Spinner } from "@/components/ui/spinner"
import { IBuktiKegiatan } from "@/types/api"

// Mock if needed, but let's try to fetch
const mockData = [
  {
    "bukti_foto_urls": ["url1", "url2"],
    "catatan": "Kegiatan berjalan lancar, semua siswa hadir.",
    "created_at": "2026-01-13T17:25:23.942Z",
    "id": 1,
    "industri_id": 51,
    "kegiatan_id": 36,
    "pembimbing_id": 26,
    "status": "Belum",
    "tanggal_realisasi": "2026-01-13",
    "updated_at": "2026-01-13T17:25:23.942Z"
  }
]

export default function HasilBukti() {
  const [data, setData] = useState<IBuktiKegiatan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await realisasiKegiatanPkl()
        // Handle if response is array or nested data
        setData(Array.isArray(response) ? response : response.data || [])
      } catch (error) {
        console.error("Error fetching hasil bukti:", error)
        // Fallback to mock for UI demonstration if API fails or is empty
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">Selesai</Badge>
      case "Belum":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50">Menunggu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8 text-[#8B1E1E]" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 bg-[#fafafa] min-h-screen">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-[#8B1E1E]">Hasil Bukti Kegiatan</h1>
        <p className="text-muted-foreground">Kelola dan tinjau riwayat bukti pelaksanaan kegiatan yang telah dikirim.</p>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader className="pb-0 pt-6 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Cari catatan atau ID..."
                className="pl-11 h-11 bg-gray-50/50 border-gray-200 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] rounded-xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="h-11 border-gray-200 text-gray-600 hover:bg-gray-50 px-5 rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="h-11 bg-[#8B1E1E] hover:bg-[#6e1818] text-white px-8 rounded-xl font-semibold">
                Cari Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-gray-700 py-4 px-6">No. ID</TableHead>
                  <TableHead className="font-bold text-gray-700 py-4 px-6">Tanggal Realisasi</TableHead>
                  <TableHead className="font-bold text-gray-700 py-4 px-6">Status</TableHead>
                  <TableHead className="font-bold text-gray-700 py-4 px-6">Catatan</TableHead>
                  <TableHead className="font-bold text-gray-700 py-4 px-6">Lampiran</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 py-4 px-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-5 px-6 font-medium text-gray-500">#{item.id.toString().slice(-4)}</TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-[#8B1E1E]/60" />
                        <span className="font-semibold text-gray-900">{formatDate(item.tanggal_realisasi)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 max-w-xs">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <p className="truncate italic">"{item.catatan || "Tidak ada catatan"}"</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50 inline-flex">
                        <ImageIcon className="h-3.5 w-3.5" />
                        <span>{item.bukti_foto_urls?.length || 0} Foto</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-gray-500 hover:text-[#8B1E1E] hover:bg-[#8B1E1E]/5 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Belum ada hasil bukti yang dikirim.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p>Menampilkan <span className="font-bold text-gray-900">{data.length}</span> data hasil bukti</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 border-gray-200">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 w-9 border-gray-200 bg-white text-[#8B1E1E] font-bold">1</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 border-gray-200">Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
