"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, RotateCcw, Loader2, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { getPermasalahanByWaliKelas } from "@/api/wali-kelas"
import { Item, Pagination } from "@/types/permasalahan"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function PermasalahanListWaliKelas() {
    const [issues, setIssues] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<Pagination | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const fetchIssues = async () => {
        setLoading(true)
        try {
            const res = await getPermasalahanByWaliKelas({
                page,
                limit: 10,
                search: debouncedSearch,
                status: (statusFilter === "ALL" || statusFilter === "all") ? undefined : statusFilter as "opened" | "in_progress" | "resolved"
            })
            setIssues(res.items || [])
            setPagination(res.pagination || null)
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat daftar permasalahan siswa")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIssues()
    }, [page, debouncedSearch, statusFilter])

    const handleReset = () => {
        setSearchQuery("")
        setDebouncedSearch("")
        setStatusFilter("all")
        setPage(1)
    }

    const getStatusVariant = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "opened": return "warning"
            case "in_progress": return "default" // or keep warning, maybe blue
            case "resolved":
            case "selesai": return "success"
            case "rejected": return "destructive"
            default: return "secondary"
        }
    }

    const getStatusText = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "opened": return "Belum Diproses"
            case "in_progress": return "Sedang Diproses"
            case "resolved":
            case "selesai": return "Selesai"
            case "rejected": return "Ditolak"
            default: return status || "Pending"
        }
    }

    return (
        <div className="space-y-6 mx-10 mb-10">
            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Filter Pengaduan</CardTitle>
                        <Button variant="outline" className="text-sm" onClick={handleReset}>
                            Atur Ulang formulir<RotateCcw className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="">
                            <label className="text-sm font-medium">Cari</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    className="pl-9"
                                    placeholder="Cari judul atau nama siswa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={(val) => {
                                setStatusFilter(val)
                                setPage(1)
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="opened">Belum Diproses</SelectItem>
                                    <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                                    <SelectItem value="resolved">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Notifikasi</CardTitle>
                    <span className="text-sm text-muted-foreground">Lihat Semua</span>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin w-8 h-8 text-[#5f2a2a]" />
                        </div>
                    ) : issues.length > 0 ? (
                        issues.map((issue) => (
                            <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border bg-gray-50 flex items-center justify-center">
                                        <Info className="h-5 w-5 text-gray-400" />
                                    </Avatar>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {issue.judul}
                                        </div>
                                        <div className="text-sm text-muted-foreground flex gap-2 divide-x">
                                            <span>Siswa: <span className="text-foreground font-medium">{issue.siswa?.nama}</span></span>
                                            <span className="pl-2">Kategori: <span className="font-medium capitalize">{issue.kategori}</span></span>
                                            <span className="pl-2 flex items-center gap-1">
                                                Tgl: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(issue.created_at))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusVariant(issue.status) as "default" | "secondary" | "destructive" | "outline"} className="capitalize px-4 py-1">
                                        {getStatusText(issue.status)}
                                    </Badge>
                                    <Button size="sm" variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4" asChild>
                                        <Link href={`/wali-kelas/permasalahan-siswa/${issue.id}`}>
                                            Periksa
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            Tidak ada data permasalahan.
                        </div>
                    )}
                    {pagination && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                            </Button>
                            <div className="text-sm font-medium">
                                Halaman {page} dari {pagination.total_pages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                                disabled={page === pagination.total_pages}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
