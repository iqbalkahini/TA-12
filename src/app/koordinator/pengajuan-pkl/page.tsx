'use client';

import React, { useEffect, useState } from "react";
import { ListGuruPembimbing, ApprovePermohonanPKL, RejectPermohonanPKL } from "@/api/kapro/indext";
import { listApprovePklKoordinator, PklPengajuanTerbaru } from "@/api/koordinator/index";
import { getKelas } from "@/api/admin/kelas/index";
import { getJurusan } from "@/api/admin/jurusan/index";
import { getIndustri } from "@/api/admin/industri/index";
import { DaftarGuruPembimbing, Kelas, Jurusan, Industri } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Search, CheckCircle, XCircle, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getSekolah } from "@/api/admin/sekolah";
import { SuratPermohonanModal } from "@/components/koordinator/SuratPermohonanModal";

export default function PengajuanPKLPage() {
    const [applications, setApplications] = useState<PklPengajuanTerbaru[]>([]);
    const [supervisors, setSupervisors] = useState<DaftarGuruPembimbing[]>([]);

    // Filter Option Lists
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
    const [industriList, setIndustriList] = useState<Industri[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    // Filters and Pagination
    const [search, setSearch] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("all");
    const [selectedJurusan, setSelectedJurusan] = useState("all");
    const [selectedIndustri, setSelectedIndustri] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Approve Dialog State
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<PklPengajuanTerbaru | null>(null);
    const [supervisorId, setSupervisorId] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reject Dialog State
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectNotes, setRejectNotes] = useState("");

    // Letter Modal State
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [schoolData, setSchoolData] = useState<any>(null);

    const loadData = async (
        searchQuery?: string,
        page: number = 1,
        kelasId?: number,
        jurusanId?: number,
        industriId?: number,
        isSearch = false
    ) => {
        try {
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const [appsRes, supervisorsRes, schoolRes, kelasRes, jurusanRes, industriRes] = await Promise.all([
                listApprovePklKoordinator(page, kelasId, jurusanId, industriId, searchQuery),
                ListGuruPembimbing(),
                getSekolah(),
                getKelas(),
                getJurusan(),
                getIndustri()
            ]);

            if (appsRes && appsRes.data) {
                const dataApps = appsRes.data || [];
                setApplications(dataApps);

                // Determine Pagination 
                const totalAppCount = appsRes.total || dataApps.length;
                setTotalItems(totalAppCount);
                setTotalPages(Math.max(1, Math.ceil(totalAppCount / 10)));
                setCurrentPage(page);
            }
            if (supervisorsRes && supervisorsRes.data) {
                setSupervisors(supervisorsRes.data);
            }
            if (schoolRes && schoolRes.data) {
                setSchoolData(schoolRes.data);
            }

            if (kelasRes && (kelasRes.data?.data || kelasRes.data)) {
                setKelasList(kelasRes.data?.data || kelasRes.data);
            }
            if (jurusanRes && (jurusanRes.data?.data || jurusanRes.data)) {
                setJurusanList(jurusanRes.data?.data || jurusanRes.data);
            }
            if (industriRes && (industriRes.data?.data || industriRes.data)) {
                setIndustriList(industriRes.data?.data || industriRes.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data pengajuan");
        } finally {
            if (isSearch) {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Effect for handling search and filters
    useEffect(() => {
        const timer = setTimeout(() => {
            const kId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            const jId = selectedJurusan !== "all" ? parseInt(selectedJurusan) : undefined;
            const iId = selectedIndustri !== "all" ? parseInt(selectedIndustri) : undefined;

            // Allow fetch even if it skips first load check
            loadData(search, 1, kId, jId, iId, true);

        }, 500);

        return () => clearTimeout(timer);
    }, [search, selectedKelas, selectedJurusan, selectedIndustri]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            const kId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            const jId = selectedJurusan !== "all" ? parseInt(selectedJurusan) : undefined;
            const iId = selectedIndustri !== "all" ? parseInt(selectedIndustri) : undefined;
            loadData(search, newPage, kId, jId, iId, true);
        }
    };

    const handleApprove = async () => {
        if (!selectedApp || !startDate || !endDate || !supervisorId) {
            toast.error("Mohon lengkapi semua data");
            return;
        }

        setIsSubmitting(true);
        try {
            await ApprovePermohonanPKL(selectedApp.application_id, {
                pembimbing_guru_id: parseInt(supervisorId),
                tanggal_mulai: format(startDate, "yyyy-MM-dd"),
                tanggal_selesai: format(endDate, "yyyy-MM-dd"),
                catatan: notes
            });
            toast.success("Pengajuan berhasil disetujui");
            setIsApproveOpen(false);

            // Reload current page data
            const kId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            const jId = selectedJurusan !== "all" ? parseInt(selectedJurusan) : undefined;
            const iId = selectedIndustri !== "all" ? parseInt(selectedIndustri) : undefined;
            loadData(search, currentPage, kId, jId, iId, false);
        } catch (error) {
            console.error("Error approving application:", error);
            toast.error("Gagal menyetujui pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedApp || !rejectNotes) {
            toast.error("Mohon isi alasan penolakan");
            return;
        }

        setIsSubmitting(true);
        try {
            await RejectPermohonanPKL(selectedApp.application_id, {
                catatan: rejectNotes
            });
            toast.success("Pengajuan berhasil ditolak");
            setIsRejectOpen(false);

            // Reload current page data
            const kId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            const jId = selectedJurusan !== "all" ? parseInt(selectedJurusan) : undefined;
            const iId = selectedIndustri !== "all" ? parseInt(selectedIndustri) : undefined;
            loadData(search, currentPage, kId, jId, iId, false);
        } catch (error) {
            console.error("Error rejecting application:", error);
            toast.error("Gagal menolak pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openApproveDialog = (app: PklPengajuanTerbaru) => {
        setSelectedApp(app);
        setSupervisorId("");
        setStartDate(undefined);
        setEndDate(undefined);
        setNotes("");
        setIsApproveOpen(true);
    };

    const openRejectDialog = (app: PklPengajuanTerbaru) => {
        setSelectedApp(app);
        setRejectNotes("");
        setIsRejectOpen(true);
    };

    const openLetterModal = (app: PklPengajuanTerbaru) => {
        setSelectedApp(app);
        setIsLetterOpen(true);
    };

    const filteredApplications = applications.filter(app => {
        if (statusFilter === "all") return true;
        return app.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    const groupedApplications = filteredApplications.reduce((acc, app) => {
        const industri = app.industri_nama || "Tanpa Industri";
        if (!acc[industri]) {
            acc[industri] = [];
        }
        acc[industri].push(app);
        return acc;
    }, {} as Record<string, PklPengajuanTerbaru[]>);

    const statusIndo = (status: string) => {
        switch (status) {
            case "Pending":
                return "Menunggu";
            case "Approved":
                return "Disetujui";
            case "Rejected":
                return "Ditolak";
            default:
                return status;
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Pengajuan PKL</h1>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama siswa..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-4 flex-wrap">
                    <Select value={selectedJurusan} onValueChange={setSelectedJurusan}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Jurusan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jurusan</SelectItem>
                            {jurusanList.map((j: any) => (
                                <SelectItem key={j.id} value={j.id.toString()}>{j.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            {kelasList.map((k: any) => (
                                <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedIndustri} onValueChange={setSelectedIndustri}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Industri" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Industri</SelectItem>
                            {industriList.map((i: any) => (
                                <SelectItem key={i.id} value={i.id.toString()}>{i.nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Tertunda</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengajuan</CardTitle>
                    <CardDescription>Kelola pengajuan PKL dari siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Industri</TableHead>
                                    <TableHead>Tanggal Pengajuan</TableHead>
                                    <TableHead>Status</TableHead>
                                    {/* <TableHead className="text-right">Aksi</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading || searchLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            Tidak ada data pengajuan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Object.entries(groupedApplications).map(([industri, apps], gIndex) => (
                                        <React.Fragment key={industri}>
                                            <TableRow className="bg-muted/50">
                                                <TableCell colSpan={5} className="font-semibold py-3 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            Industri: {industri}
                                                            <Badge variant="secondary" className="ml-2 font-normal rounded-full">
                                                                {apps.length} Siswa
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-8"
                                                            onClick={() => openLetterModal(apps[0])}
                                                        >
                                                            <Printer className="h-4 w-4 mr-1" />
                                                            Cetak Surat
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {apps.map((app, index) => (
                                                <TableRow key={app.application_id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{app.siswa_username}</span>
                                                            <span className="text-xs text-muted-foreground">{app.siswa_nisn}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{app.industri_nama}</TableCell>
                                                    <TableCell>{format(new Date(app.tanggal_permohonan), "dd MMM yyyy")}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                app.status === "Approved" ? "default" :
                                                                    app.status === "Rejected" || app.status === "Ditolak" ? "destructive" :
                                                                        "secondary"
                                                            }
                                                            className={
                                                                app.status === "Approved" ? "bg-green-500 hover:bg-green-600" :
                                                                    (app.status === "Pending" || app.status === "Menunggu") ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                                                            }
                                                        >
                                                            {statusIndo(app.status)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-end space-x-2 p-4">
                        <div className="text-sm text-muted-foreground mr-4">
                            Halaman {currentPage} dari {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading || searchLoading}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0 || loading || searchLoading}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Approve */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Setujui Pengajuan PKL</DialogTitle>
                        <DialogDescription>
                            Tentukan pembimbing dan periode PKL untuk <b>{selectedApp?.siswa_username}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pembimbing">Guru Pembimbing</Label>
                            <Select value={supervisorId} onValueChange={setSupervisorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Guru Pembimbing" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supervisors.map((guru) => (
                                        <SelectItem key={guru.id} value={guru.id.toString()}>
                                            {guru.nama} - {guru.nip}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Tanggal Mulai</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tanggal Selesai</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="catatan">Catatan (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tambahkan catatan untuk siswa..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button onClick={handleApprove} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Setujui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Reject */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan PKL</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk <b>{selectedApp?.siswa_username}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="alasan">Alasan Penolakan</Label>
                            <Textarea
                                id="alasan"
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                placeholder="Jelaskan kenapa pengajuan ditolak..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tolak Pengajuan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Support modal compatibility by casting */}
            {selectedApp && (
                <SuratPermohonanModal
                    isOpen={isLetterOpen}
                    onClose={() => setIsLetterOpen(false)}
                    application={
                        {
                            application: {
                                id: selectedApp.application_id,
                                tanggal_permohonan: selectedApp.tanggal_permohonan,
                                status: selectedApp.status
                            },
                            siswa_username: selectedApp.siswa_username,
                            siswa_nisn: selectedApp.siswa_nisn,
                            industri_nama: selectedApp.industri_nama,
                            kelas_nama: "-",
                            jurusan_nama: "-"
                        } as any
                    }
                    allApplications={applications as any}
                    schoolData={schoolData}
                />
            )}
        </div>
    );
}