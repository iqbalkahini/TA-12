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
import { Search, CheckCircle, Clock, XCircle, ArrowRightLeft } from "lucide-react";

// --- Types ---
type TransferStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface TransferRequestDto {
    id: number;
    siswa_nama: string;
    siswa_nisn: string;
    jurusan: string;
    tempat_lama: string;
    tempat_baru: string;
    alasan: string;
    status: TransferStatus;
}

// --- Mock Data ---
const MOCK_DATA: TransferRequestDto[] = [
    {
        id: 1,
        siswa_nama: "Siti Nurhaliza",
        siswa_nisn: "12345678",
        jurusan: "Teknik Informatika",
        tempat_lama: "CV. Digital Solusi",
        tempat_baru: "PT. Teknologi Maju",
        alasan: "Jarak terlalu jauh dari rumah",
        status: "Menunggu",
    },
    {
        id: 2,
        siswa_nama: "Ahmad Fauzi",
        siswa_nisn: "12345679",
        jurusan: "Teknik Mesin",
        tempat_lama: "PT. Otomotif Prima",
        tempat_baru: "PT. Manufaktur Indo",
        alasan: "Bidang lebih sesuai minat",
        status: "Disetujui",
    },
    {
        id: 3,
        siswa_nama: "Rizki Pratama",
        siswa_nisn: "12345680",
        jurusan: "Teknik Elektro",
        tempat_lama: "CV. Elektronik Jaya",
        tempat_baru: "PT. Listrik Negara",
        alasan: "Masalah transportasi",
        status: "Menunggu",
    },
    {
        id: 4,
        siswa_nama: "Dewi Anggraini",
        siswa_nisn: "12345681",
        jurusan: "Akuntansi",
        tempat_lama: "Koperasi Unit Desa",
        tempat_baru: "Bank Rakyat Cabang",
        alasan: "Ingin pengalaman perbankan",
        status: "Ditolak",
    },
    {
        id: 5,
        siswa_nama: "Budi Santoso",
        siswa_nisn: "12345682",
        jurusan: "Multimedia",
        tempat_lama: "Studio Foto Indah",
        tempat_baru: "Creative Agency One",
        alasan: "Mencari mentor yang lebih aktif",
        status: "Menunggu",
    },
];

export default function PindahPKLPage() {
    const [data, setData] = useState<TransferRequestDto[]>(MOCK_DATA);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 5;

    // Filter Logic
    const filteredData = data.filter((item) => {
        const matchSearch =
            item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
            item.jurusan.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    // Stats Logic
    const stats = {
        total: data.length,
        menunggu: data.filter((i) => i.status === "Menunggu").length,
        disetujui: data.filter((i) => i.status === "Disetujui").length,
        ditolak: data.filter((i) => i.status === "Ditolak").length,
    };

    // Action Handlers (Mock)
    const handleAction = (id: number, newStatus: TransferStatus) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Daftar Pengajuan Pindah PKL</h2>
                <p className="text-muted-foreground">
                    Kelola permohonan kepindahan tempat PKL siswa.
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
                            <ArrowRightLeft className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Menunggu Persetujuan</p>
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
                        placeholder="Cari siswa..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
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
                            <TableHead>Tempat Baru</TableHead>
                            <TableHead>Tempat Lama</TableHead>
                            <TableHead className="w-[200px]">Alasan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Tidak ada pengajuan ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.siswa_nama}</span>
                                            <span className="text-xs text-muted-foreground">{item.siswa_nisn}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium text-gray-700">{item.jurusan}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{item.tempat_baru}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">{item.tempat_lama}</div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600 line-clamp-2" title={item.alasan}>
                                            {item.alasan}
                                        </p>
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
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleAction(item.id, "Disetujui")}
                                                >
                                                    Setujui
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
                                                Sudah diproses
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Menampilkan {paginatedData.length > 0 ? (page - 1) * limit + 1 : 0} hingga {Math.min(page * limit, filteredData.length)} dari {filteredData.length} data
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center justify-center w-8 h-8 bg-[#7a0f0f] text-white rounded-md text-sm font-medium">
                        {page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
