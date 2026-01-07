"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// --- Types ---
type PerizinanStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface PerizinanDto {
    id: number;
    siswa_nama: string;
    siswa_nisn: string;
    jurusan: string;
    alasan_izin: string;
    tanggal_mulai: string; // ISO Date
    tanggal_selesai: string; // ISO Date
    status: PerizinanStatus;
    approved_by?: string;
}

// --- Mock Data ---
const MOCK_DATA: PerizinanDto[] = [
    {
        id: 1,
        siswa_nama: "Siti Nurhaliza",
        siswa_nisn: "12345678",
        jurusan: "Teknik Informatika",
        alasan_izin: "Sakit demam tinggi, perlu istirahat di rumah",
        tanggal_mulai: "2024-01-15",
        tanggal_selesai: "2024-01-16",
        status: "Menunggu",
    },
    {
        id: 2,
        siswa_nama: "Budi Santoso",
        siswa_nisn: "12345679",
        jurusan: "Teknik Mesin",
        alasan_izin: "Keperluan keluarga mendesak di kampung halaman",
        tanggal_mulai: "2024-01-14",
        tanggal_selesai: "2024-01-14",
        status: "Disetujui",
        approved_by: "Ahmad S.",
    },
    {
        id: 3,
        siswa_nama: "Dewi Sartika",
        siswa_nisn: "12345680",
        jurusan: "Akuntansi",
        alasan_izin: "Mengikuti seminar nasional akuntansi",
        tanggal_mulai: "2024-01-13",
        tanggal_selesai: "2024-01-13",
        status: "Menunggu",
    },
    {
        id: 4,
        siswa_nama: "Andi Wijaya",
        siswa_nisn: "12345681",
        jurusan: "Teknik Elektro",
        alasan_izin: "Ingin berlibur bersama keluarga",
        tanggal_mulai: "2024-01-12",
        tanggal_selesai: "2024-01-15",
        status: "Ditolak",
        approved_by: "Ahmad S.",
    },
    {
        id: 5,
        siswa_nama: "Maya Sari",
        siswa_nisn: "12345682",
        jurusan: "Manajemen",
        alasan_izin: "Kontrol kesehatan rutin di rumah sakit",
        tanggal_mulai: "2024-01-11",
        tanggal_selesai: "2024-01-11",
        status: "Menunggu",
    },
];

export default function PerizinanPage() {
    const [data, setData] = useState<PerizinanDto[]>(MOCK_DATA);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Filter Logic
    const filteredData = data.filter((item) => {
        const matchSearch =
            item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
            item.jurusan.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Stats Logic
    const stats = {
        total: data.length,
        menunggu: data.filter((i) => i.status === "Menunggu").length,
        disetujui: data.filter((i) => i.status === "Disetujui").length,
        ditolak: data.filter((i) => i.status === "Ditolak").length,
    };

    // Date Formatter
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy", { locale: id });
        } catch {
            return dateString;
        }
    };

    // Action Handlers (Mock)
    const handleAction = (id: number, newStatus: PerizinanStatus) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: newStatus, approved_by: "Kapro (Anda)" } : item
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Daftar Pengajuan Perizinan</h2>
                <p className="text-muted-foreground">
                    Kelola dan validasi izin siswa selama masa PKL.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Pengajuan</p>
                            <h3 className="text-2xl font-bold">{stats.total}</h3>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Menunggu</p>
                            <h3 className="text-2xl font-bold text-yellow-600">{stats.menunggu}</h3>
                        </div>
                        <div className="h-10 w-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Disetujui</p>
                            <h3 className="text-2xl font-bold text-green-600">{stats.disetujui}</h3>
                        </div>
                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Ditolak</p>
                            <h3 className="text-2xl font-bold text-red-600">{stats.ditolak}</h3>
                        </div>
                        <div className="h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <XCircle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau jurusan..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="Menunggu">Menunggu</SelectItem>
                            <SelectItem value="Disetujui">Disetujui</SelectItem>
                            <SelectItem value="Ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Main Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[200px]">Nama</TableHead>
                            <TableHead>Jurusan</TableHead>
                            <TableHead className="w-[300px]">Alasan Izin</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data perizinan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.siswa_nama}</span>
                                            <span className="text-xs text-muted-foreground">{item.siswa_nisn}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal">
                                            {item.jurusan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600 line-clamp-2" title={item.alasan_izin}>
                                            {item.alasan_izin}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {formatDate(item.tanggal_mulai)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.status === "Menunggu" && (
                                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">Menunggu</Badge>
                                        )}
                                        {item.status === "Disetujui" && (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Disetujui</Badge>
                                        )}
                                        {item.status === "Ditolak" && (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Ditolak</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.status === "Menunggu" ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-[#7a0f0f] hover:bg-[#5c0b0b] text-white"
                                                    onClick={() => handleAction(item.id, "Disetujui")}
                                                >
                                                    Konfirmasi
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(item.id, "Ditolak")}
                                                >
                                                    Tolak
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                {item.status === "Disetujui" ? `Disetujui oleh ${item.approved_by || "-"}` : "Alasan tidak valid"}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground">
                Menampilkan {filteredData.length} dari {data.length} data
            </div>
        </div>
    );
}
