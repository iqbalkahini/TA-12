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
    Upload,
    Calendar,
    Clock,
    Building2,
    Users,
    MapPin,
    ChevronRight,
    Info
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { TasksRealisasiPkl } from "@/types/api"
import { getTasksRealisasiPkl } from "@/api/pembimbing"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

const mockPayload = {
    "data": [
        {
            "industri": {
                "id": 51,
                "nama": "PT Nusantara",
                "alamat": "Surabaya Barat",
                "jenis_industri": "Ekonomi Bisnis"
            },
            "siswa_count": 2,
            "siswa": [
                {
                    "id": 86,
                    "nama": "Ahmad Fauzi",
                    "username": "ahmadf",
                    "nisn": "9890989098",
                    "kelas": "XII DKV 3"
                },
                {
                    "id": 87,
                    "nama": "Sari Indah",
                    "username": "sari_i",
                    "nisn": "9890989099",
                    "kelas": "XII DKV 3"
                }
            ],
            "tasks": [
                {
                    "kegiatan": {
                        "id": 36,
                        "jenis": "Pembekalan",
                        "tanggal_mulai": "2026-01-21",
                        "tanggal_selesai": "2026-01-28",
                        "deskripsi": "ini adlah jadwal pembekalan seluhruh siswa kelas 12",
                        "is_active": false,
                        "can_submit": false
                    }
                },
                {
                    "kegiatan": {
                        "id": 34,
                        "jenis": "Monitoring2",
                        "tanggal_mulai": "2026-02-10",
                        "tanggal_selesai": "2026-02-13",
                        "deskripsi": "test",
                        "is_active": true,
                        "can_submit": true
                    }
                },
                {
                    "kegiatan": {
                        "id": 35,
                        "jenis": "Penjemputan",
                        "tanggal_mulai": "2026-02-19",
                        "tanggal_selesai": "2026-02-27",
                        "deskripsi": "test",
                        "is_active": false,
                        "can_submit": false
                    }
                }
            ]
        }
    ],
    "summary": {
        "total_industri": 1,
        "total_tasks": 3,
        "completed_tasks": 0,
        "pending_tasks": 3
    }
}

export default function JadwalBukti() {
    const [search, setSearch] = useState("")
    const [data, setData] = useState<TasksRealisasiPkl | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTasksRealisasiPkl();
                setData(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Spinner className="h-7 w-7 absolute top-1/2 left-1/2" />
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 bg-[#fafafa] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-3xl font-bold tracking-tight text-[#8B1E1E]">Jadwal & Unggah Bukti</h1>
                    <p className="text-muted-foreground">Monitoring kegiatan PKL dan unggah bukti pelaksanaan per industri.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-4 py-2 border-r border-gray-100 last:border-0 text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1.5">Total Industri</p>
                        <p className="text-xl font-bold text-[#8B1E1E] leading-none">{mockPayload.summary.total_industri}</p>
                    </div>
                    <div className="px-4 py-2 border-r border-gray-100 last:border-0 text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1.5">Tugas Aktif</p>
                        <p className="text-xl font-bold text-amber-600 leading-none">{mockPayload.summary.pending_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                        placeholder="Cari industri atau lokasi..."
                        className="pl-11 h-12 bg-white border-transparent shadow-sm focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] rounded-xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-12 border-none bg-white shadow-sm hover:bg-gray-50 rounded-xl px-5 text-gray-600">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button className="h-12 bg-[#8B1E1E] hover:bg-[#6e1818] shadow-lg shadow-[#8B1E1E]/10 items-center text-white px-8 rounded-xl transition-all font-semibold">
                        Cari
                    </Button>
                </div>
            </div>

            <div className="grid gap-8">
                {(data?.data?.length ?? 0) > 0 ? data?.data?.map((item, idx) => (
                    <div key={idx} className="group flex flex-col gap-4">
                        {/* Industry Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#6e1818] flex items-center justify-center shadow-lg shadow-[#8B1E1E]/20 shrink-0">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-gray-900 leading-none">{item.industri.nama}</h2>
                                        <Badge variant="outline" className="bg-[#8B1E1E]/5 text-[#8B1E1E] border-[#8B1E1E]/10 rounded-full font-bold px-3">
                                            {item.industri.jenis_industri}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-[#8B1E1E]/60" />
                                            <span>{item.industri.alamat}</span>
                                        </div>
                                        <span className="text-gray-200">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4 text-[#8B1E1E]/60" />
                                            <span>{item.siswa_count} Siswa Terdaftar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Avatar Group */}
                            <div className="flex -space-x-3 overflow-hidden p-1">
                                {item.siswa.map((siswa, sIdx) => (
                                    <TooltipProvider key={sIdx}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                    <AvatarFallback className="bg-gray-100 text-xs font-bold text-gray-600">
                                                        {siswa.nama.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white border text-gray-900 border-gray-100 shadow-xl rounded-xl p-3">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-bold">{siswa.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{siswa.kelas} • NISN: {siswa.nisn}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                                {item.siswa_count > 2 && (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-100">
                                        +{item.siswa_count - 2}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Task Card */}
                        <Card className="border-none shadow-xl shadow-gray-200/50 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                            <CardContent className="p-0 sm:p-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Jenis Kegiatan</TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Rentang Waktu</TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {item.tasks.map((task, tIdx) => (
                                            <TableRow key={tIdx} className="group/row border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${task.kegiatan.is_active ? 'bg-amber-100' : 'bg-gray-50'}`}>
                                                            <Calendar className={`h-4 w-4 ${task.kegiatan.is_active ? 'text-amber-600' : 'text-gray-400'}`} />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-900">{task.kegiatan.jenis}</span>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-[#8B1E1E]" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="max-w-xs bg-white border text-gray-900 border-gray-100 shadow-xl rounded-xl p-3">
                                                                            <p className="text-sm font-medium leading-relaxed">{task.kegiatan.deskripsi}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-100/50">
                                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{formatDate(task.kegiatan.tanggal_mulai)} - {formatDate(task.kegiatan.tanggal_selesai)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    {task.kegiatan.is_active ? (
                                                        <Badge className="bg-amber-50 text-amber-600 border-amber-200/50 px-3 py-1 rounded-full font-bold animate-pulse">AKTIF</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-transparent px-3 py-1 rounded-full font-bold">NON-AKTIF</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-right">
                                                    <Button
                                                        size="sm"
                                                        disabled={!task.kegiatan.can_submit}
                                                        className={`h-10 rounded-xl px-5 transition-all font-bold ${task.kegiatan.can_submit
                                                            ? 'bg-[#8B1E1E] hover:bg-[#6e1818] text-white shadow-md shadow-[#8B1E1E]/10'
                                                            : 'bg-gray-100 text-gray-400 border-transparent'
                                                            }`}
                                                        onClick={() => {
                                                            router.push(`/pembimbing/jadwal/${task.kegiatan.id}/industri/${item.industri.id}/bukti`)
                                                        }}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Unggah Bukti
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )) : <Card className="border-none shadow-xl shadow-gray-200/50 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                    <CardContent className="p-0 sm:p-2">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Jenis Kegiatan</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Rentang Waktu</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                    <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>}
            </div>
        </div>
    )
}