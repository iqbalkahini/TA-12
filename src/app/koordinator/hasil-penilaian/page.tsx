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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getJurusan } from "@/api/admin/jurusan";
import { getKelas } from "@/api/admin/kelas";
import { getIndustri, getIndustriById } from "@/api/admin/industri";
import { getGuruById } from "@/api/admin/guru";
import { Jurusan, Kelas, Industri } from "@/types/api";
import {
    Search,
    FileSearch,
    GraduationCap,
    Building2,
    CalendarDays,
    CheckCircle2,
    Settings,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cetakSertifikat, koordinatorPenilaianApi } from "@/api/penilaian";
import {
    ReviewApplicationItem,
    PenilaianApplicationDetail,
    SertifikatPKL,
    PenilaianForm,
} from "@/types/penilaian";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { downloadPDF } from "@/api/files";
import { Progress } from "@/components/ui/progress";
import { getDetailSIA, listApprovePklKoordinator } from "@/api/koordinator";

export default function HasilPenilaianPage() {
    const [reviews, setReviews] = useState<ReviewApplicationItem[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [jurusans, setJurusans] = useState<Jurusan[]>([]);
    const [kelasData, setKelasData] = useState<Kelas[]>([]);
    const [industris, setIndustris] = useState<Industri[]>([]);

    const [selectedJurusan, setSelectedJurusan] = useState<string>("all");
    const [selectedKelas, setSelectedKelas] = useState<string>("all");
    const [selectedIndustri, setSelectedIndustri] = useState<string>("all");

    const [activeReview, setActiveReview] = useState<ReviewApplicationItem | null>(null);
    const [detailData, setDetailData] = useState<PenilaianApplicationDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [formActive, setFormActive] = useState<PenilaianForm | null>(null);

    const [submitting, setSubmitting] = useState(false);

    const [isBatchDownloading, setIsBatchDownloading] = useState(false);
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    const [isCertNoModalOpen, setIsCertNoModalOpen] = useState(false);
    const [certNo, setCertNo] = useState("");
    const [tempCertNo, setTempCertNo] = useState("");

    useEffect(() => {
        fetchFormActive();
        const loadJurusans = async () => {
            const res = await getJurusan();
            const list = res?.data?.data || res?.data || res || [];
            if (Array.isArray(list)) setJurusans(list);
        };
        loadJurusans();

        // Load certificate number from localStorage
        const storedCertNo = localStorage.getItem("tahun_ini_nomor_sertifikat");
        if (storedCertNo) {
            setCertNo(storedCertNo);
            setTempCertNo(storedCertNo);
        }
    }, []);

    useEffect(() => {
        const loadDependentData = async () => {
            const jId = selectedJurusan !== "all" ? Number(selectedJurusan) : undefined;

            const kRes = await getKelas(undefined, undefined, jId);
            const kList = kRes?.data?.data || kRes?.data || kRes || [];
            if (Array.isArray(kList)) setKelasData(kList);

            const iRes = await getIndustri(undefined, undefined, jId);
            const iList = iRes?.data?.data || iRes?.data || iRes || [];
            if (Array.isArray(iList)) setIndustris(iList);

            // Optional: reset kelas and industri selection if they do not exist
            setSelectedKelas("all");
            setSelectedIndustri("all");
        };
        loadDependentData();
    }, [selectedJurusan]);

    useEffect(() => {
        fetchReviews();
    }, [searchQuery, selectedJurusan, selectedKelas, selectedIndustri]);

    const fetchReviews = async () => {
        try {
            setLoadingList(true);
            const jId = selectedJurusan !== "all" ? Number(selectedJurusan) : null;
            const kId = selectedKelas !== "all" ? Number(selectedKelas) : null;
            const iId = selectedIndustri !== "all" ? Number(selectedIndustri) : null;

            const res = await koordinatorPenilaianApi.getReviewList(1, 100, searchQuery, jId, kId, iId);
            setReviews(res.data || []);
        } catch (error) {
            console.error("Gagal mengambil daftar hasil penilaian:", error);
            toast.error("Gagal memuat daftar hasil penilaian.");
        } finally {
            setLoadingList(false);
        }
    };

    const filteredReviews = reviews;

    const handleSaveCertNo = () => {
        localStorage.setItem("tahun_ini_nomor_sertifikat", tempCertNo);
        setCertNo(tempCertNo);
        setIsCertNoModalOpen(false);
        toast.success("Nomor sertifikat berhasil disimpan.");
    };

    const fetchFormActive = async () => {
        try {
            const res = await koordinatorPenilaianApi.getForms();
            setFormActive(res.data.find((form: PenilaianForm) => form.is_active) || null);
        } catch (error) {
            console.error("Gagal mengambil daftar form aktif:", error);
            toast.error("Gagal memuat daftar form aktif.");
        }
    }

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

    const handleDownloadSertifikat = async (review: ReviewApplicationItem) => {
        try {
            setSubmitting(true);

            // Fetch rincian nilai untuk mendapatkan skor tiap aspek
            const detail = await koordinatorPenilaianApi.getReviewDetail(review.application_id);
            const industriRes = await getIndustriById(review.industri_id);
            const namaPembimbing = industriRes?.data?.pic || industriRes?.pic || "-";

            let kode_jurusan = review.jurusan_nama
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toLowerCase();

            switch (kode_jurusan) {
                case "tkdj":
                    kode_jurusan = "tkj"
                    break;
                case "rpl":
                    kode_jurusan = "rpl"
                    break;
                case "dkv":
                    kode_jurusan = "dkv"
                    break;
                case "tei":
                    kode_jurusan = "tei"
                    break;
                case "tflm":
                    kode_jurusan = "tflm"
                    break;
                default:
                    break;
            }


            let hasil_pkl: SertifikatPKL["hasil_pkl"] = "Cukup";
            const num = Number(review.rata_rata);
            if (!isNaN(num)) {
                if (num >= 90) hasil_pkl = "Amat Baik";
                else if (num >= 80) hasil_pkl = "Baik";
                else if (num >= 70) hasil_pkl = "Cukup";
                else hasil_pkl = "Kurang";
            }

            let tglMulaiFormatted = "-";
            let tglSelesaiFormatted = "-";
            try {
                const approveList = await listApprovePklKoordinator(1, undefined, undefined, undefined, review.siswa_nisn);
                const pklData = approveList?.data?.find(a => a.application_id === review.application_id);
                if (pklData) {
                    if (pklData.tanggal_mulai) tglMulaiFormatted = new Date(pklData.tanggal_mulai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                    if (pklData.tanggal_selesai) tglSelesaiFormatted = new Date(pklData.tanggal_selesai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                }
            } catch (err) {
                console.error("Failed to fetch PKL dates", err);
            }

            const nilaiPKL = {
                aspek_1: detail.items?.find(i => i.form_item_id === detail.form_items?.[0]?.id)?.skor || 0,
                desc_1: detail.form_items?.[0]?.tujuan_pembelajaran || formActive?.items?.[0]?.tujuan_pembelajaran || "-",
                aspek_2: detail.items?.find(i => i.form_item_id === detail.form_items?.[1]?.id)?.skor || 0,
                desc_2: detail.form_items?.[1]?.tujuan_pembelajaran || formActive?.items?.[1]?.tujuan_pembelajaran || "-",
                aspek_3: detail.items?.find(i => i.form_item_id === detail.form_items?.[2]?.id)?.skor || 0,
                desc_3: detail.form_items?.[2]?.tujuan_pembelajaran || formActive?.items?.[2]?.tujuan_pembelajaran || "-",
                aspek_4: detail.items?.find(i => i.form_item_id === detail.form_items?.[3]?.id)?.skor || 0,
                desc_4: detail.form_items?.[3]?.tujuan_pembelajaran || formActive?.items?.[3]?.tujuan_pembelajaran || "-"
            };

            // Get data from localStorage
            const storedSertifikatStr = localStorage.getItem(`sertifikat_data_${review.siswa_id}`);
            let sertifikatData = {
                nama_pimpinan: "Nama Pimpinan",
                jenis_nomor_pimpinan: "NIP",
                nip_pimpinan: "198012122005011002",
                jabatan_pimpinan: "Jabatan Pimpinan",
                nama_pembimbing: namaPembimbing,
                jenis_nomor_pembimbing: "NIP",
                nip_pembimbing: "198012122005011002",
                jabatan_pembimbing: "Jabatan Pembimbing"
            };

            if (storedSertifikatStr) {
                try {
                    const parsed = JSON.parse(storedSertifikatStr);
                    sertifikatData = {
                        ...sertifikatData,
                        ...parsed,
                        nama_pembimbing: parsed.nama_pembimbing || namaPembimbing // fallback to API if not in localStorage or empty
                    };
                } catch (e) {
                    console.error("Failed to parse sertifikat data from localStorage", e);
                }
            }

            let studentYear = "";
            if (tglSelesaiFormatted !== "-") {
                const match = tglSelesaiFormatted.match(/\b(20\d{2})\b/);
                if (match) studentYear = match[1];
            }
            if (!studentYear && review.finalized_at) {
                studentYear = new Date(review.finalized_at).getFullYear().toString();
            }

            let finalCertNo = certNo || "-";
            if (studentYear) {
                finalCertNo = finalCertNo.replace(/(.*)\b20\d{2}\b/, "$1" + studentYear);
            }

            const studentData: SertifikatPKL = {
                nomor_sertifikat: finalCertNo,
                siswa: {
                    nama: review.siswa_username,
                    nisn: review.siswa_nisn,
                },
                nama_industri: review.industri_nama,
                tanggal_mulai: tglMulaiFormatted,
                tanggal_selesai: tglSelesaiFormatted,
                tanggal_terbit: review.finalized_at
                    ? new Date(review.finalized_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                    : "-",
                hasil_pkl,
                nilai: nilaiPKL,
                ...sertifikatData
            };
            const response = await cetakSertifikat(kode_jurusan, studentData);
            downloadPDF(response.filename);
            toast.success(`Sertifikat ${review.siswa_username} berhasil diunduh!`);
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(`Terjadi kesalahan saat mengunduh sertifikat ${review.siswa_username}.`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const isFilterActive = selectedJurusan !== "all" || selectedKelas !== "all" || selectedIndustri !== "all";

    const handleBatchDownload = async () => {
        if (selectedStudents.length === 0) {
            toast.error("Tidak ada siswa yang dipilih untuk diunduh.");
            return;
        }

        setIsBatchDownloading(true);
        setBatchProgress({ current: 0, total: selectedStudents.length });

        let successCount = 0;
        let failCount = 0;

        const studentsToDownload = filteredReviews.filter(r => selectedStudents.includes(r.application_id));

        for (let i = 0; i < studentsToDownload.length; i++) {
            const review = studentsToDownload[i];

            try {
                // Fetch rincian nilai untuk mendapatkan skor tiap aspek
                const detail = await koordinatorPenilaianApi.getReviewDetail(review.application_id);
                const industriRes = await getIndustriById(review.industri_id);
                const namaPimpinan = industriRes?.data?.pic || industriRes?.pic || "-";

                let kode_jurusan = review.jurusan_nama
                    .split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .toLowerCase();

                switch (kode_jurusan) {
                    case "tkdj": kode_jurusan = "tkj"; break;
                    case "rpl": kode_jurusan = "rpl"; break;
                    case "dkv": kode_jurusan = "dkv"; break;
                    case "tei": kode_jurusan = "tei"; break;
                    case "tflm": kode_jurusan = "tflm"; break;
                }

                let hasil_pkl: SertifikatPKL["hasil_pkl"] = "Cukup";
                const num = Number(review.rata_rata);
                if (!isNaN(num)) {
                    if (num >= 90) hasil_pkl = "Amat Baik";
                    else if (num >= 80) hasil_pkl = "Baik";
                    else if (num >= 70) hasil_pkl = "Cukup";
                    else hasil_pkl = "Kurang";
                }

                let tglMulaiFormatted = "-";
                let tglSelesaiFormatted = "-";
                try {
                    const approveList = await listApprovePklKoordinator(1, undefined, undefined, undefined, review.siswa_nisn);
                    const pklData = approveList?.data?.find(a => a.application_id === review.application_id);
                    if (pklData) {
                        if (pklData.tanggal_mulai) tglMulaiFormatted = new Date(pklData.tanggal_mulai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                        if (pklData.tanggal_selesai) tglSelesaiFormatted = new Date(pklData.tanggal_selesai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                    }
                } catch (err) {
                    console.error("Failed to fetch PKL dates", err);
                }

                // Get data from localStorage
                const storedSertifikatStr = localStorage.getItem(`sertifikat_data_${review.siswa_id}`);
                let sertifikatData = {
                    nama_pimpinan: "Nama Pimpinan",
                    jenis_nomor_pimpinan: "NIP",
                    nip_pimpinan: "198012122005011002",
                    jabatan_pimpinan: "Jabatan Pimpinan",
                    nama_pembimbing: namaPimpinan,
                    jenis_nomor_pembimbing: "NIP",
                    nip_pembimbing: "198012122005011002",
                    jabatan_pembimbing: "Jabatan Pembimbing"
                };

                if (storedSertifikatStr) {
                    try {
                        const parsed = JSON.parse(storedSertifikatStr);
                        sertifikatData = {
                            ...sertifikatData,
                            ...parsed,
                            nama_pembimbing: parsed.nama_pembimbing || namaPimpinan // fallback to API if not in localStorage or empty
                        };
                    } catch (e) {
                        console.error("Failed to parse sertifikat data from localStorage", e);
                    }
                }

                let studentYear = "";
                if (tglSelesaiFormatted !== "-") {
                    const match = tglSelesaiFormatted.match(/\b(20\d{2})\b/);
                    if (match) studentYear = match[1];
                }
                if (!studentYear && review.finalized_at) {
                    studentYear = new Date(review.finalized_at).getFullYear().toString();
                }

                let finalCertNo = certNo || "-";
                if (studentYear) {
                    finalCertNo = finalCertNo.replace(/(.*)\b20\d{2}\b/, "$1" + studentYear);
                }

                const studentData: SertifikatPKL = {
                    nomor_sertifikat: finalCertNo,
                    siswa: {
                        nama: review.siswa_username,
                        nisn: review.siswa_nisn,
                    },
                    nama_industri: review.industri_nama,
                    tanggal_mulai: tglMulaiFormatted,
                    tanggal_selesai: tglSelesaiFormatted,
                    tanggal_terbit: review.finalized_at
                        ? new Date(review.finalized_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                        : "-",
                    hasil_pkl,
                    nilai: {
                        aspek_1: detail.items?.find(i => i.form_item_id === detail.form_items?.[0]?.id)?.skor || 0,
                        desc_1: detail.form_items?.[0]?.tujuan_pembelajaran || formActive?.items?.[0]?.tujuan_pembelajaran || "-",
                        aspek_2: detail.items?.find(i => i.form_item_id === detail.form_items?.[1]?.id)?.skor || 0,
                        desc_2: detail.form_items?.[1]?.tujuan_pembelajaran || formActive?.items?.[1]?.tujuan_pembelajaran || "-",
                        aspek_3: detail.items?.find(i => i.form_item_id === detail.form_items?.[2]?.id)?.skor || 0,
                        desc_3: detail.form_items?.[2]?.tujuan_pembelajaran || formActive?.items?.[2]?.tujuan_pembelajaran || "-",
                        aspek_4: detail.items?.find(i => i.form_item_id === detail.form_items?.[3]?.id)?.skor || 0,
                        desc_4: detail.form_items?.[3]?.tujuan_pembelajaran || formActive?.items?.[3]?.tujuan_pembelajaran || "-"
                    },
                    ...sertifikatData
                };

                const response = await cetakSertifikat(kode_jurusan, studentData);
                downloadPDF(response.filename);
                successCount++;
            } catch (error) {
                console.error(`Gagal mengunduh sertifikat ${review.siswa_username}:`, error);
                failCount++;
            }

            setBatchProgress({ current: i + 1, total: studentsToDownload.length });
        }

        setIsBatchDownloading(false);
        if (failCount === 0) {
            toast.success(`Berhasil mengunduh ${successCount} sertifikat.`);
            setIsDownloadModalOpen(false);
        } else {
            toast.warning(`Berhasil mengunduh ${successCount} sertifikat, gagal ${failCount}.`);
        }
    };

    const getSIA = async (siswa_id: number) => {
        try {
            const response = await getDetailSIA(siswa_id)
            return response
        } catch (error) {
            console.log(error)
            alert("Terjadi kesalahan saat memngambil data SIA")
        }
    }

    const handleExportCSV = async () => {
        if (!isFilterActive) {
            toast.error("Pilih minimal satu filter (Jurusan, Kelas, atau Industri) untuk mengekspor CSV.");
            return;
        }

        if (filteredReviews.length === 0) {
            toast.error("Tidak ada data siswa untuk diekspor.");
            return;
        }

        setIsBatchDownloading(true);
        toast.info("Menyiapkan data untuk diekspor...");

        try {
            const dataToExport = await Promise.all(
                filteredReviews.map(async (review, index) => {
                    const sia = await getSIA(review.siswa_id);
                    let pembimbingNama = "-";
                    if (review.pembimbing_guru_id) {
                        try {
                            const guruRes = await getGuruById(review.pembimbing_guru_id);
                            pembimbingNama = guruRes?.data?.nama || guruRes?.nama || "-";
                        } catch (err) {
                            console.error("Failed to fetch guru:", err);
                        }
                    }

                    return {
                        no: index + 1,
                        nama_siswa: review.siswa_username,
                        nisn: Number(review.siswa_nisn) || 0,
                        kelas: review.kelas_nama,
                        jurusan: review.jurusan_nama,
                        industri: review.industri_nama,
                        pembimbing: pembimbingNama,
                        sakit: sia?.sakit || 0,
                        izin: sia?.izin || 0,
                        alpha: 0,
                        total_skor: review.total_skor || 0,
                        rata_rata: review.rata_rata || "0",
                        tanggal_finalisasi: review.finalized_at
                            ? new Date(review.finalized_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '-'
                    };
                })
            );

            exportToCSV(dataToExport, `Data_Nilai_PKL_${new Date().getTime()}.csv`);
            toast.success("Berhasil mengekspor data CSV.");
        } catch (error) {
            console.error("Gagal mengekspor CSV:", error);
            toast.error("Terjadi kesalahan saat menyiapkan data ekspor.");
        } finally {
            setIsBatchDownloading(false);
        }
    };

    function exportToCSV(data: {
        no: number,
        nama_siswa: string,
        nisn: number,
        kelas: string,
        jurusan: string,
        industri: string,
        pembimbing: string,
        sakit: number,
        izin: number,
        alpha: number,
        total_skor: number,
        rata_rata: string,
        tanggal_finalisasi: string
    }[], filename = 'data-export.csv') {
        // 1. Ambil header dari kunci objek pertama, lalu ganti underscore dengan spasi + Title Case
        const headers = Object.keys(data[0]).map(key =>
            key.replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase())
        ).join(',');

        // 2. Map data menjadi baris-baris string
        const rows = data.map(obj =>
            Object.values(obj).map(val => {
                const strVal = String(val);
                // Jika mengandung koma, kutip ganda, atau baris baru, bungkus dengan kutip dua
                if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
                    return `"${strVal.replace(/"/g, '""')}"`;
                }
                return strVal;
            }).join(',')
        );

        // 3. Gabungkan header dan baris dengan baris baru (\n)
        const csvContent = [headers, ...rows].join('\n');

        // 4. Buat file download di browser
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

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
                    <div className="flex flex-col md:flex-row justify-between mb-6 md:items-center gap-4">
                        <div className="flex flex-col gap-4 flex-1">
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama atau NISN siswa..."
                                        className="pl-8 bg-background"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setSearchQuery(searchInput);
                                            }
                                        }}
                                        disabled={isBatchDownloading}
                                    />
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => setSearchQuery(searchInput)}
                                    disabled={isBatchDownloading}
                                >
                                    Cari
                                </Button>
                                <Button
                                    variant="default"
                                    disabled={!isFilterActive || isBatchDownloading || filteredReviews.length === 0}
                                    onClick={handleExportCSV}
                                    className="w-full md:w-auto shrink-0"
                                >
                                    Expor CSV
                                </Button>
                                <Button
                                    variant="default"
                                    disabled={!isFilterActive || isBatchDownloading || filteredReviews.length === 0}
                                    onClick={() => {
                                        if (!isFilterActive) {
                                            toast.error("Pilih minimal satu filter (Jurusan, Kelas, atau Industri) untuk mengunduh semua sertifikat.");
                                            return;
                                        }
                                        if (filteredReviews.length === 0) {
                                            toast.error("Tidak ada data siswa untuk diunduh.");
                                            return;
                                        }
                                        setSelectedStudents(filteredReviews.map(r => r.application_id));
                                        setIsDownloadModalOpen(true);
                                    }}
                                    className="w-full md:w-auto shrink-0"
                                >
                                    Unduh Semua Sertifikat
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setTempCertNo(certNo);
                                        setIsCertNoModalOpen(true);
                                    }}
                                    className="w-full md:w-auto shrink-0 gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    Atur Nomor Sertifikat
                                </Button>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                                <Select value={selectedJurusan} onValueChange={setSelectedJurusan} disabled={isBatchDownloading}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Pilih Jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Jurusan</SelectLabel>
                                            <SelectItem value="all">Semua Jurusan</SelectItem>
                                            {jurusans.map((j) => (
                                                <SelectItem key={j.id} value={j.id.toString()}>{j.kode}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Select value={selectedKelas} onValueChange={setSelectedKelas} disabled={isBatchDownloading}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Kelas</SelectLabel>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            {kelasData.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Select value={selectedIndustri} onValueChange={setSelectedIndustri} disabled={isBatchDownloading}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Pilih Industri" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Industri / Tempat PKL</SelectLabel>
                                            <SelectItem value="all">Semua Industri</SelectItem>
                                            {industris.map((i) => (
                                                <SelectItem key={i.id} value={i.id.toString()}>{i.nama}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
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
                                                <Button className="mt-1" disabled={submitting} onClick={() => handleDownloadSertifikat(review)}>Cetak Sertifikat</Button>
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

            {/* DOWNLOAD SELECTION MODAL */}
            <Dialog open={isDownloadModalOpen} onOpenChange={(open) => {
                if (!isBatchDownloading) setIsDownloadModalOpen(open);
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <div className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl">
                            Pilih Siswa untuk Diunduh
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            Centang siswa yang ingin Anda unduh sertifikatnya. Secara default, semua siswa yang difilter akan terpilih.
                        </p>
                    </div>

                    <div className="px-6 overflow-y-auto max-h-full space-y-4">
                        <div className="space-x-3 pb-4 border-b">
                            {true && (
                                <div className="mb-6 space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Mengunduh sertifikat...</span>
                                        <span>{batchProgress.current} / {batchProgress.total}</span>
                                    </div>
                                    <Progress value={batchProgress.total === 0 ? 0 : (batchProgress.current / batchProgress.total) * 100} className="h-2" />
                                </div>
                            )}
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="select-all"
                                    checked={selectedStudents.length === filteredReviews.length && filteredReviews.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedStudents(filteredReviews.map(r => r.application_id));
                                        } else {
                                            setSelectedStudents([]);
                                        }
                                    }}
                                    disabled={isBatchDownloading}
                                />
                                <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
                                    Pilih Semua ({filteredReviews.length} Siswa)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {filteredReviews.map(review => (
                                <div key={review.application_id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                    <Checkbox
                                        id={`student-${review.application_id}`}
                                        checked={selectedStudents.includes(review.application_id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedStudents(prev => [...prev, review.application_id]);
                                            } else {
                                                setSelectedStudents(prev => prev.filter(id => id !== review.application_id));
                                            }
                                        }}
                                        disabled={isBatchDownloading}
                                    />
                                    <label htmlFor={`student-${review.application_id}`} className="flex-1 flex justify-between text-sm cursor-pointer">
                                        <span className="font-semibold">{review.siswa_username}</span>
                                        <span className="text-muted-foreground">{review.kelas_nama}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t bg-muted/20 mt-auto flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsDownloadModalOpen(false)} disabled={isBatchDownloading}>
                            Batal
                        </Button>
                        <Button onClick={handleBatchDownload} disabled={isBatchDownloading || selectedStudents.length === 0}>
                            {isBatchDownloading ? `Mengunduh (${batchProgress.current}/${batchProgress.total})...` : `Unduh ${selectedStudents.length} Sertifikat`}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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

            {/* CERTIFICATE NUMBER MODAL */}
            <Dialog open={isCertNoModalOpen} onOpenChange={setIsCertNoModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="p-6">
                        <DialogTitle className="text-xl">
                            Atur Nomor Sertifikat
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            Masukkan nomor sertifikat untuk tahun ini. Nomor ini akan digunakan sebagai identitas pada sertifikat yang diunduh.
                        </p>
                        
                        <div className="grid gap-4 py-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="cert-no">Nomor Sertifikat</Label>
                                <Input
                                    id="cert-no"
                                    value={tempCertNo}
                                    onChange={(e) => setTempCertNo(e.target.value)}
                                    placeholder="Contoh: 001/PKL/2024"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsCertNoModalOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleSaveCertNo}>
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
