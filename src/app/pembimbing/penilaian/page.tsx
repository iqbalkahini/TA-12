'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileEdit, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Dummy data siswa bimbingan dan 4 nilai penilaian
const dummyStudents = [
    {
        id: '1',
        nama: 'Ahmad Fauzi',
        nisn: '0051234567',
        kelas: 'XII RPL 1',
        industri: 'PT. Telkom Indonesia',
        penilaian: {
            softSkill: 90,
            normaK3LH: 85,
            kompetensiTeknis: 88,
            alurBisnis: 92,
        },
        status: 'Dinilai',
    },
    {
        id: '2',
        nama: 'Budi Santoso',
        nisn: '0057654321',
        kelas: 'XII RPL 1',
        industri: 'PT. PLN (Persero)',
        penilaian: {
            softSkill: 78,
            normaK3LH: 82,
            kompetensiTeknis: 80,
            alurBisnis: 85,
        },
        status: 'Dinilai',
    },
    {
        id: '3',
        nama: 'Citra Kirana',
        nisn: '0069876543',
        kelas: 'XII RPL 2',
        industri: 'PT. GoTo Gojek Tokopedia',
        penilaian: {
            softSkill: null,
            normaK3LH: null,
            kompetensiTeknis: null,
            alurBisnis: null,
        },
        status: 'Belum Dinilai',
    },
    {
        id: '4',
        nama: 'Deni Saputra',
        nisn: '0053456789',
        kelas: 'XII RPL 2',
        industri: 'PT. Bukalapak',
        penilaian: {
            softSkill: 95,
            normaK3LH: 88,
            kompetensiTeknis: 90,
            alurBisnis: 94,
        },
        status: 'Dinilai',
    },
    {
        id: '5',
        nama: 'Eka Putri',
        nisn: '0061122334',
        kelas: 'XII RPL 1',
        industri: 'PT. Telkom Indonesia',
        penilaian: {
            softSkill: null,
            normaK3LH: null,
            kompetensiTeknis: null,
            alurBisnis: null,
        },
        status: 'Belum Dinilai',
    },
];

export default function PembimbingPenilaianPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = dummyStudents.filter((student) =>
        student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nisn.includes(searchQuery)
    );

    const getRataRata = (penilaian: any) => {
        if (!penilaian.softSkill) return '-';
        const total =
            penilaian.softSkill +
            penilaian.normaK3LH +
            penilaian.kompetensiTeknis +
            penilaian.alurBisnis;
        return (total / 4).toFixed(1);
    };

    const getPredikat = (nilai: number | null) => {
        if (!nilai) return '-';
        if (nilai >= 90) return 'Sangat Baik';
        if (nilai >= 80) return 'Baik';
        if (nilai >= 70) return 'Cukup';
        return 'Kurang';
    };

    const getBadgeVariant = (status: string) => {
        return status === 'Dinilai' ? 'default' : 'secondary';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Penilaian Siswa</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola dan input nilai praktik kerja lapangan (PKL) siswa bimbingan Anda.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa Bimbingan</CardTitle>
                    <CardDescription>
                        Terdapat 4 aspek penilaian utama sesuai dengan standar industri.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau NISN siswa..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border overflow-x-auto">
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px] whitespace-nowrap">Nama & NISN</TableHead>
                                        <TableHead className="whitespace-nowrap">Industri / Tempat PKL</TableHead>
                                        <TableHead className="text-center whitespace-nowrap">
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-help decoration-dashed underline underline-offset-4">Aspek 1</TooltipTrigger>
                                                <TooltipContent className="max-w-[300px]">
                                                    <p>Menerapkan soft skill yang dibutuhkan di dunia kerja (tempat PKL).</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableHead>
                                        <TableHead className="text-center whitespace-nowrap">
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-help decoration-dashed underline underline-offset-4">Aspek 2</TooltipTrigger>
                                                <TooltipContent className="max-w-[400px]">
                                                    <p>Menerapkan norma, Prosedur Operasional Standar (POS), serta Kesehatan, Keselamatan Kerja, dan Lingkungan Hidup (K3LH) yang ada di dunia kerja (tempat PKL).</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableHead>
                                        <TableHead className="text-center whitespace-nowrap">
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-help decoration-dashed underline underline-offset-4">Aspek 3</TooltipTrigger>
                                                <TooltipContent className="max-w-[400px]">
                                                    <p>Menerapkan kompetensi teknis yang sudah dipelajari di sekolah dan/atau baru dipelajari di dunia kerja (tempat PKL).</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableHead>
                                        <TableHead className="text-center whitespace-nowrap">
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-help decoration-dashed underline underline-offset-4">Aspek 4</TooltipTrigger>
                                                <TooltipContent className="max-w-[300px]">
                                                    <p>Memahami alur bisnis dunia kerja tempat PKL dan wawasan wirausaha.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableHead>
                                        <TableHead className="text-center whitespace-nowrap">Rata-rata</TableHead>
                                        <TableHead className="text-center whitespace-nowrap">Status</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="font-medium">{student.nama}</div>
                                                    <div className="text-sm text-muted-foreground">{student.nisn}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{student.kelas}</div>
                                                </TableCell>
                                                <TableCell>{student.industri}</TableCell>
                                                <TableCell className="text-center">
                                                    {student.penilaian.softSkill ? (
                                                        <div className="flex flex-col items-center">
                                                            <span>{student.penilaian.softSkill.toFixed(1)}</span>
                                                            <span className="text-xs text-muted-foreground">{getPredikat(student.penilaian.softSkill)}</span>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {student.penilaian.normaK3LH ? (
                                                        <div className="flex flex-col items-center">
                                                            <span>{student.penilaian.normaK3LH.toFixed(1)}</span>
                                                            <span className="text-xs text-muted-foreground">{getPredikat(student.penilaian.normaK3LH)}</span>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {student.penilaian.kompetensiTeknis ? (
                                                        <div className="flex flex-col items-center">
                                                            <span>{student.penilaian.kompetensiTeknis.toFixed(1)}</span>
                                                            <span className="text-xs text-muted-foreground">{getPredikat(student.penilaian.kompetensiTeknis)}</span>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {student.penilaian.alurBisnis ? (
                                                        <div className="flex flex-col items-center">
                                                            <span>{student.penilaian.alurBisnis.toFixed(1)}</span>
                                                            <span className="text-xs text-muted-foreground">{getPredikat(student.penilaian.alurBisnis)}</span>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    {student.penilaian.softSkill ? (
                                                        <div className="flex flex-col items-center">
                                                            <span>{getRataRata(student.penilaian)}</span>
                                                            <span className="text-xs text-muted-foreground">{getPredikat(Number(getRataRata(student.penilaian)))}</span>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={getBadgeVariant(student.status)} className={student.status === 'Dinilai' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600 text-white'}>
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                                                        <FileEdit className="h-4 w-4" />
                                                        <span className="hidden sm:inline-block">
                                                            {student.status === 'Dinilai' ? 'Edit' : 'Input Nilai'}
                                                        </span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                Data siswa tidak ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}