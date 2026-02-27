'use client';

import { ListPermohonanPKL } from "@/api/kapro/indext";
import { DaftarPermohonanPKL, ApiResponseSekolah } from "@/types/api";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Printer, Loader2 } from "lucide-react";
import { getSekolah } from "@/api/public";
import { postDataPersetujuan, downloadPDF } from "@/api/files";
import { toast } from "sonner";

interface GroupedData {
    industryName: string;
    students: DaftarPermohonanPKL[];
}

export default function PersetujuanPkl() {
    const [groupedData, setGroupedData] = useState<Record<number, GroupedData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [schoolData, setSchoolData] = useState<ApiResponseSekolah['data'] | null>(null);
    const [isGenerating, setIsGenerating] = useState<number | null>(null); // Store industry ID being generated

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPermohonan, resSekolah] = await Promise.all([
                    ListPermohonanPKL(),
                    getSekolah()
                ]);

                // Filter only approved applications
                const approvedData = resPermohonan?.data?.filter((item: DaftarPermohonanPKL) => item.application.status === "Approved") || [];

                const grouped: Record<number, GroupedData> = {};
                approvedData.forEach((item: DaftarPermohonanPKL) => {
                    const industryId = item.application.industri_id;
                    if (!grouped[industryId]) {
                        grouped[industryId] = {
                            industryName: item.industri_nama,
                            students: []
                        };
                    }
                    grouped[industryId].students.push(item);
                });

                setGroupedData(grouped);
                if (resSekolah?.data) {
                    setSchoolData(resSekolah.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                toast.error("Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateLetter = async (industryId: number, industryName: string, students: DaftarPermohonanPKL[]) => {
        if (!schoolData) {
            toast.error("Data sekolah belum dimuat.");
            return;
        }

        setIsGenerating(industryId);
        try {
            const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            // Kab. Malang, 12 Januari 2026
            const tempatTanggal = `${schoolData.kabupaten_kota.replace("Kab.", "").trim()}, ${date}`;
            console.log(schoolData);
            const payload = {
                nama_perusahaan: industryName,
                school_info: {
                    alamat_jalan: schoolData.jalan,
                    kab_kota: schoolData.kabupaten_kota,
                    kode_pos: schoolData.kode_pos,
                    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Coat_of_arms_of_East_Java.svg/960px-Coat_of_arms_of_East_Java.svg.png',
                    nama_sekolah: schoolData.nama_sekolah,
                    provinsi: schoolData.provinsi,
                    telepon: schoolData.nomor_telepon
                },
                students: students.map(s => ({
                    nama: s.siswa_username // Using username as name based on interface
                })),
                tempat_tanggal: tempatTanggal
            };

            const response = await postDataPersetujuan(payload);

            if (response && response.filename) {
                await downloadPDF(response.filename);
                toast.success("Surat berhasil diunduh");
            } else {
                toast.error("Gagal mendapatkan file surat");
            }
        } catch (error) {
            console.error("Error generating letter:", error);
            toast.error("Gagal membuat surat permohonan");
        } finally {
            setIsGenerating(null);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Persetujuan PKL</h1>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Memuat data...</span>
                </div>
            ) : Object.keys(groupedData).length === 0 ? (
                <p className="text-muted-foreground">Tidak ada data persetujuan PKL.</p>
            ) : (
                <div className="grid gap-6">
                    {Object.entries(groupedData).map(([key, group]) => {
                        const industryId = Number(key);
                        return (
                            <Card key={industryId} className="w-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div>
                                        <CardTitle className="text-xl font-bold">{group.industryName}</CardTitle>
                                        <CardDescription>{group.students.length} Siswa</CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => handleGenerateLetter(industryId, group.industryName, group.students)}
                                        variant="outline"
                                        className="gap-2"
                                        disabled={isGenerating === industryId}
                                    >
                                        {isGenerating === industryId ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Printer className="h-4 w-4" />
                                        )}
                                        Menghasilkan Surat
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">No</TableHead>
                                                <TableHead>Nama Siswa</TableHead>
                                                <TableHead>NISN</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Jurusan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {group.students.map((student, index) => (
                                                <TableRow key={student.application.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{student.siswa_username}</TableCell>
                                                    <TableCell>{student.siswa_nisn}</TableCell>
                                                    <TableCell>{student.kelas_nama}</TableCell>
                                                    <TableCell>{student.jurusan_nama}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}