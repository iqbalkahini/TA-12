"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    FileSearch,
    GraduationCap,
    Building2,
    CalendarDays,
    CheckCircle2,
} from "lucide-react";
import { koordinatorPenilaianApi } from "@/api/penilaian";
import {
    ReviewApplicationItem,
    PenilaianApplicationDetail,
} from "@/types/penilaian";
import { toast } from "sonner";

export default function HasilPenilaianPage() {
    const [reviews, setReviews] = useState<ReviewApplicationItem[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [activeReview, setActiveReview] = useState<ReviewApplicationItem | null>(null);
    const [detailData, setDetailData] = useState<PenilaianApplicationDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async (search: string = "") => {
        try {
            setLoadingList(true);
            const res = await koordinatorPenilaianApi.getReviewList(1, 100, search);
            setReviews(res.data || []);
        } catch (error) {
            console.error("Gagal mengambil daftar hasil penilaian:", error);
            toast.error("Gagal memuat daftar hasil penilaian.");
        } finally {
            setLoadingList(false);
        }
    };

    // Optional: Trigger search on enter or button click, but for small dataset we can just filter client-side.
    // We'll just do client-side filtering for simplicity since we fetched max 100.
    const filteredReviews = reviews.filter(
        (review) =>
            review.siswa_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.siswa_nisn.includes(searchQuery)
    );

    const handleOpenDetail = async (review: ReviewApplicationItem) => {
        setActiveReview(review);
        setIsDetailModalOpen(true);
        setLoadingDetail(true);
        setDetailData(null);

        try {
            const detail = await koordinatorPenilaianApi.getReviewDetail(
                review.application_id
            );
            setDetailData(detail);
        } catch (error) {
            console.error("Gagal mengambil detail hasil penilaian:", error);
            toast.error("Gagal memuat rincian nilai siswa.");
            setIsDetailModalOpen(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const getPredikat = (nilai: number | string | null) => {
        if (!nilai) return "-";
        const num = Number(nilai);
        if (isNaN(num)) return "-";
        if (num >= 90) return "Sangat Baik";
        if (num >= 80) return "Baik";
        if (num >= 70) return "Cukup";
        return "Kurang";
    };

    return (
        <div className="px-5 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Review Hasil Penilaian</h2>
                    <p className="text-muted-foreground">
                        Pantau dan tinjau nilai akhir PKL siswa yang telah disubmit oleh Guru Pembimbing.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle>Daftar Rekapitulasi Nilai</CardTitle>
                    <CardDescription>
                        Tabel di bawah ini hanya menampilkan laporan nilai siswa yang statusnya sudah final.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau NISN siswa..."
                                className="pl-8 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">No</TableHead>
                                    <TableHead className="w-[200px] whitespace-nowrap">Nama & NISN</TableHead>
                                    <TableHead className="whitespace-nowrap">Jurusan / Kelas</TableHead>
                                    <TableHead className="whitespace-nowrap">Tempat Industri</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Nilai Akhir</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Tanggal Finalisasi</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingList ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Memuat daftar nilai...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReviews.length > 0 ? (
                                    filteredReviews.map((review, index) => (
                                        <TableRow key={review.application_id}>
                                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="font-semibold">{review.siswa_username}</div>
                                                <div className="text-sm text-muted-foreground">{review.siswa_nisn}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium">{review.jurusan_nama}</div>
                                                <div className="text-xs text-muted-foreground">{review.kelas_nama}</div>
                                            </TableCell>
                                            <TableCell>{review.industri_nama}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-lg text-green-600 dark:text-green-500">
                                                        {review.rata_rata}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
                                                        {getPredikat(review.rata_rata)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {review.finalized_at ? new Date(review.finalized_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                }) : '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-2"
                                                    onClick={() => handleOpenDetail(review)}
                                                >
                                                    <FileSearch className="h-4 w-4" /> Buka Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Data hasil penilaian tidak ditemukan. Pastikan ada guru pembimbing yang telah menyelesaikan form penilaian.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* DETAIL MODAL */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <div className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl flex items-center justify-between">
                            <div>
                                Lembar Hasil Penilaian PKL
                                <p className="text-sm font-normal text-muted-foreground mt-1">
                                    Direview oleh Koordinator
                                </p>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600 gap-1 text-white text-sm py-1">
                                <CheckCircle2 className="h-4 w-4" /> Final
                            </Badge>
                        </DialogTitle>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-full">
                        {loadingDetail ? (
                            <div className="py-12 text-center text-muted-foreground">Memuat rincian nilai siswa...</div>
                        ) : detailData && activeReview ? (
                            <div className="space-y-6 pr-2">

                                {/* Info Card */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 border rounded-lg">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Siswa</p>
                                                <p className="font-semibold text-sm">{activeReview.siswa_username} ({activeReview.siswa_nisn})</p>
                                                <p className="text-sm">{activeReview.kelas_nama}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tempat PKL</p>
                                                <p className="font-medium text-sm">{activeReview.industri_nama}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:border-l md:pl-4">
                                        <div className="flex items-start gap-3">
                                            <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Disubmit Pada</p>
                                                <p className="font-medium text-sm">
                                                    {detailData.finalized_at ? new Date(detailData.finalized_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    }) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-background border rounded-md p-3 flex justify-between items-center shadow-sm">
                                            <span className="text-sm font-medium">Nilai Akhir / Rata-rata</span>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold block text-green-600 dark:text-green-500">{detailData.rata_rata}</span>
                                                <span className="text-xs text-muted-foreground">Total Skor: {detailData.total_skor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                <div className="space-y-3">
                                    <h3 className="font-bold border-b pb-2 text-primary">Rincian Komponen Penilaian</h3>
                                    {detailData.items?.length > 0 && detailData.form_items?.length > 0 ? (
                                        detailData.form_items.map((formItem, idx) => {
                                            const scoreItem = detailData.items.find(i => i.form_item_id === formItem.id);

                                            return (
                                                <div key={formItem.id} className="p-4 border rounded-md bg-card shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
                                                    <div className="md:col-span-9 flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                                                            {formItem.urutan || idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium leading-normal">{formItem.tujuan_pembelajaran}</p>
                                                            {scoreItem?.deskripsi && (
                                                                <p className="mt-2 text-sm text-foreground/80 italic border-l-2 border-primary/40 pl-3 py-1 bg-muted/30">
                                                                    &ldquo;{scoreItem.deskripsi}&rdquo;
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l pt-3 md:pt-0 pl-0 md:pl-4">
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Skor</span>
                                                        <div className="flex flex-col items-end md:items-center">
                                                            <span className="text-2xl font-bold">{scoreItem?.skor || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                                            Rincian nilai tidak tersedia.
                                        </div>
                                    )}
                                </div>

                                {/* Final Comment */}
                                <div className="mt-6 pt-4 border-t">
                                    <h3 className="font-bold mb-2">Catatan Akhir Pembimbing</h3>
                                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-md text-sm leading-relaxed text-amber-900 dark:text-amber-100 min-h-[80px]">
                                        {detailData.catatan_akhir ? detailData.catatan_akhir : <span className="text-muted-foreground italic">Tidak ada catatan pendukung dari pembimbing.</span>}
                                    </div>
                                </div>

                            </div>
                        ) : null}
                    </div>

                    <div className="p-4 border-t bg-muted/20 mt-auto flex justify-end">
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                            Tutup Panel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
