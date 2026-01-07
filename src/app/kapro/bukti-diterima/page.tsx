'use client';

import { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// --- Types & Mock Service (Moved from src/api/kapro/bukti-diterima.ts) ---

export type PklStatusType = "Pending" | "Approved" | "Rejected" | "Completed";

export interface PklApplicationDto {
    id: number;
    siswa_id: number;
    industri_id: number;
    status: PklStatusType;
    tanggal_permohonan: string; // ISO Date
    tanggal_mulai?: string; // Date string YYYY-MM-DD
    tanggal_selesai?: string; // Date string YYYY-MM-DD
    decided_at?: string;
    kaprog_note?: string;
    catatan?: string;
    pembimbing_guru_id?: number;
    processed_by?: number;
}

export interface PklApplicationReviewDto {
    application: PklApplicationDto;
    siswa_username: string;
    siswa_nisn: string;
    kelas_id: number;
    kelas_nama: string;
    jurusan_id: number;
    jurusan_nama: string;
    industri_nama: string;
    file_bukti_url?: string;
}

export interface ListPklApplicationReviewDto {
    data: PklApplicationReviewDto[];
    total: number;
}

const MOCK_DATA: PklApplicationReviewDto[] = [
    {
        application: {
            id: 1,
            siswa_id: 101,
            industri_id: 501,
            status: "Approved",
            tanggal_permohonan: "2024-01-10T08:00:00Z",
            tanggal_mulai: "2024-01-15",
            tanggal_selesai: "2024-06-15",
        },
        siswa_username: "Ahmad Fauzi",
        siswa_nisn: "12345678",
        kelas_id: 10,
        kelas_nama: "XII RPL 1",
        jurusan_id: 1,
        jurusan_nama: "Rekayasa Perangkat Lunak",
        industri_nama: "PT Teknologi Maju",
        file_bukti_url: "surat_penerimaan_ahmad.pdf"
    },
    {
        application: {
            id: 2,
            siswa_id: 102,
            industri_id: 502,
            status: "Approved",
            tanggal_permohonan: "2024-01-12T09:30:00Z",
            tanggal_mulai: "2024-01-20",
            tanggal_selesai: "2024-06-20",
        },
        siswa_username: "Siti Nurhaliza",
        siswa_nisn: "12345679",
        kelas_id: 10,
        kelas_nama: "XII Tkj 2",
        jurusan_id: 2,
        jurusan_nama: "Teknik Komputer Jaringan",
        industri_nama: "CV. Digital Solutions",
        file_bukti_url: "bukti_diterima_siti.pdf"
    },
    {
        application: {
            id: 3,
            siswa_id: 103,
            industri_id: 503,
            status: "Approved",
            tanggal_permohonan: "2024-01-05T10:15:00Z",
            tanggal_mulai: "2024-02-01",
            tanggal_selesai: "2024-07-01",
        },
        siswa_username: "Budi Santoso",
        siswa_nisn: "12345680",
        kelas_id: 11,
        kelas_nama: "XII MM 1",
        jurusan_id: 3,
        jurusan_nama: "Multimedia",
        industri_nama: "Studio Kreatif Nusantara",
        file_bukti_url: "acceptance_letter_budi.pdf"
    }
];

async function getBuktiDiterimaList(
    page: number = 1,
    limit: number = 10,
    search: string = ""
): Promise<ListPklApplicationReviewDto> {
    // Simulate API Delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filtered = MOCK_DATA.filter(item =>
        item.application.status === "Approved"
    );

    if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(item =>
            item.siswa_username.toLowerCase().includes(lowerSearch) ||
            item.industri_nama.toLowerCase().includes(lowerSearch) ||
            item.siswa_nisn.includes(lowerSearch)
        );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
        data: paginated,
        total: filtered.length
    };
}

// --- Component ---

export default function BuktiDiterimaPage() {
    const [data, setData] = useState<PklApplicationReviewDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getBuktiDiterimaList(page, limit, search);
            setData(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "d MMM yyyy", { locale: id });
        } catch {
            return dateString;
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bukti Diterima</h2>
                    <p className="text-muted-foreground">
                        Kelola dan pantau bukti penerimaan PKL siswa.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari nama siswa..."
                        className="pl-8"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Bukti Diterima PKL</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Industri</TableHead>
                                    <TableHead>Mulai</TableHead>
                                    <TableHead>Selesai</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                <span className="text-muted-foreground">Memuat data...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={item.application.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.siswa_username}</span>
                                                    <span className="text-xs text-muted-foreground">{item.siswa_nisn}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.industri_nama}</span>
                                                    <span className="text-xs text-muted-foreground">Jakarta</span> {/* Mock City */}
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(item.application.tanggal_mulai)}</TableCell>
                                            <TableCell>{formatDate(item.application.tanggal_selesai)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <FileText className="h-4 w-4" />
                                                    <span className="text-sm font-medium truncate max-w-[150px]">
                                                        {item.file_bukti_url || "bukti.pdf"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">Lihat</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Unduh</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {data.length > 0 ? (page - 1) * limit + 1 : 0} sampai {Math.min(page * limit, total)} dari {total} data
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                            >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
