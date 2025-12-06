"use client"

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, User, Building2, Calendar as CalendarIcon, GraduationCap, School, X, ChevronsUpDown, Check } from "lucide-react";
import { DaftarPermohonanPKL, DaftarGuruPembimbing, FormDataPermohonanKapro } from "@/types/api";
import { ApprovePermohonanPKL, ListGuruPembimbing, ListPermohonanPKL, RejectPermohonanPKL } from "@/api/kapro/indext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PengajuanPKL() {
    const [dataPermohonanPkl, setDataPermohonanPkl] = useState<DaftarPermohonanPKL[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [guruPembimbing, setGuruPembimbing] = useState<DaftarGuruPembimbing[]>([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [openPembimbing, setOpenPembimbing] = useState(false);
    const [openTanggalMulai, setOpenTanggalMulai] = useState(false);
    const [openTanggalSelesai, setOpenTanggalSelesai] = useState(false);
    const [tanggalMulai, setTanggalMulai] = useState<Date | undefined>(undefined);
    const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>(undefined);
    const [formData, setFormData] = useState<FormDataPermohonanKapro>({
        catatan: "",
        pembimbing_guru_id: 0,
        tanggal_mulai: "",
        tanggal_selesai: ""
    });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await ListPermohonanPKL();
                if (!response) {
                    console.log("error pada saat fetch data permohonan pkl");
                    setDataPermohonanPkl([]);
                } else {
                    console.log(response.data);
                    setDataPermohonanPkl(response.data);
                }
            } catch (error) {
                console.error("Error fetching permohonan PKL:", error);
                setDataPermohonanPkl([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [refresh]);

    useEffect(() => {
        async function fetchGuruPembimbing() {
            try {
                const response = await ListGuruPembimbing();
                if (response) {
                    setGuruPembimbing(response);
                } else {
                    console.log("error pada saat fetch guru pembimbing");
                }
            } catch (error) {
                console.error("Error fetching guru pembimbing:", error);
            }
        }
        fetchGuruPembimbing();
    }, []);

    const filteredData = dataPermohonanPkl.filter((item) =>
        item.siswa_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.siswa_nisn.includes(searchQuery)
    );
    const badgeStyle = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === "pending" || statusLower === "menunggu") return "bg-yellow-100 text-yellow-700";
        if (statusLower === "approved" || statusLower === "disetujui") return "bg-green-100 text-green-700";
        if (statusLower === "rejected" || statusLower === "ditolak") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusText = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === "pending") return "Menunggu";
        if (statusLower === "approved") return "Disetujui";
        if (statusLower === "rejected") return "Ditolak";
        return status;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedId(0);
        setTanggalMulai(undefined);
        setTanggalSelesai(undefined);
        setFormData({
            catatan: "",
            pembimbing_guru_id: 0,
            tanggal_mulai: "",
            tanggal_selesai: ""
        });
    };

    const handleApprove = async () => {
        if (!formData.pembimbing_guru_id || formData.pembimbing_guru_id === 0) {
            toast.error("Pilih guru pembimbing terlebih dahulu");
            return;
        }
        if (!tanggalMulai || !tanggalSelesai) {
            toast.error("Tanggal mulai dan selesai wajib diisi");
            return;
        }

        const payload = {
            ...formData,
            tanggal_mulai: format(tanggalMulai, "yyyy-MM-dd"),
            tanggal_selesai: format(tanggalSelesai, "yyyy-MM-dd")
        };

        try {
            setLoadingSubmit(true);
            const response = await ApprovePermohonanPKL(selectedId, payload);
            if (!response) {
                toast.warning("Terjadi Kesalahan saat menyetujui permohonan PKL");
                return;
            }
            toast.success("Permohonan PKL berhasil disetujui");
            handleCloseModal();
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error approving:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleReject = async () => {
        if (!formData.catatan) {
            toast.error("Catatan penolakan wajib diisi");
            return;
        }

        try {
            setLoadingSubmit(true);
            const response = await RejectPermohonanPKL(selectedId, { catatan: formData.catatan });
            if (!response) {
                toast.warning("Terjadi Kesalahan saat menolak permohonan PKL");
                return;
            }
            toast.success("Permohonan PKL berhasil ditolak");
            handleCloseModal();
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error rejecting:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <div className="w-full p-6 space-y-6">
            {/* Search & Filter */}
            <div className="w-full flex items-center justify-between border rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 w-full">
                    <Search className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama siswa atau NISN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <Card className="p-6 rounded-xl border">
                <h2 className="text-lg font-semibold mb-4">Daftar Pengajuan PKL</h2>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Memuat data...</span>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">
                            {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada pengajuan PKL'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {filteredData.map((row) => (
                                <div
                                    key={row.application.id}
                                    className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                                >
                                    {/* Header - Nama Siswa & Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{row.siswa_username}</h3>
                                                <p className="text-sm text-gray-500">NISN: {row.siswa_nisn}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${badgeStyle(row.application.status)}`}>
                                            {getStatusText(row.application.status)}
                                        </span>
                                    </div>

                                    {/* Content - Info Detail */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <School className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Kelas</p>
                                                <p className="text-sm font-medium text-gray-900">{row.kelas_nama}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Jurusan</p>
                                                <p className="text-sm font-medium text-gray-900">{row.jurusan_nama}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Building2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Industri Tujuan</p>
                                                <p className="text-sm font-medium text-gray-900">{row.industri_nama}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <CalendarIcon className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Tanggal Pengajuan</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(row.application.tanggal_permohonan)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catatan jika ada */}
                                    {row.application.catatan && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                                            <p className="text-xs text-blue-700 font-medium mb-1">Catatan Siswa:</p>
                                            <p className="text-sm text-blue-900">{row.application.catatan}</p>
                                        </div>
                                    )}

                                    {/* Footer - Aksi */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <p className="text-xs text-gray-500">ID Pengajuan: #{row.application.id}</p>
                                        <div className="flex gap-2">
                                            {row.application.status.toLowerCase() === "approved" ? (
                                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                    <span className="font-medium">Sudah Disetujui</span>
                                                </div>
                                            ) : row.application.status.toLowerCase() === "rejected" ? (
                                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                    <span className="font-medium">Sudah Ditolak</span>
                                                </div>
                                            ) : (
                                                <>
                                                    {
                                                        row.application.status.toLowerCase() === "pending" && (
                                                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => {
                                                                setSelectedId(row.application.id)
                                                                setOpenModal(true)
                                                            }}>
                                                                Kelola
                                                            </Button>
                                                        )
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                            <p>Menampilkan {filteredData.length} dari {dataPermohonanPkl.length} data</p>
                        </div>
                    </>
                )}
            </Card>

            {/* Modal Kelola Pengajuan */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Kelola Pengajuan PKL</DialogTitle>
                        <DialogDescription>
                            Lengkapi data berikut untuk menyetujui atau menolak pengajuan PKL
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Pembimbing Guru */}
                        <div className="space-y-2">
                            <Label htmlFor="pembimbing">
                                Guru Pembimbing <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={openPembimbing} onOpenChange={setOpenPembimbing}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openPembimbing}
                                        className="w-full justify-between"
                                    >
                                        {formData.pembimbing_guru_id
                                            ? guruPembimbing.find((guru) => guru.id === formData.pembimbing_guru_id)?.nama +
                                            " - " +
                                            guruPembimbing.find((guru) => guru.id === formData.pembimbing_guru_id)?.nip
                                            : "Pilih Guru Pembimbing..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Cari guru pembimbing..." />
                                        <CommandList>
                                            <CommandEmpty>Tidak ada guru ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {guruPembimbing.map((guru) => (
                                                    <CommandItem
                                                        key={guru.id}
                                                        value={`${guru.nama} ${guru.nip}`}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, pembimbing_guru_id: guru.id });
                                                            setOpenPembimbing(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.pembimbing_guru_id === guru.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {guru.nama} - {guru.nip}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p className="text-xs text-gray-500">Pilih guru yang akan membimbing siswa</p>
                        </div>

                        {/* Tanggal Mulai */}
                        <div className="space-y-2">
                            <Label>
                                Tanggal Mulai PKL <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={openTanggalMulai} onOpenChange={setOpenTanggalMulai}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !tanggalMulai && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {tanggalMulai ? format(tanggalMulai, "PPP", { locale: id }) : "Pilih tanggal mulai"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={tanggalMulai}
                                        onSelect={(date) => {
                                            setTanggalMulai(date);
                                            setOpenTanggalMulai(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Tanggal Selesai */}
                        <div className="space-y-2">
                            <Label>
                                Tanggal Selesai PKL <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={openTanggalSelesai} onOpenChange={setOpenTanggalSelesai}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !tanggalSelesai && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {tanggalSelesai ? format(tanggalSelesai, "PPP", { locale: id }) : "Pilih tanggal selesai"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={tanggalSelesai}
                                        onSelect={(date) => {
                                            setTanggalSelesai(date);
                                            setOpenTanggalSelesai(false);
                                        }}
                                        initialFocus
                                        disabled={(date) => tanggalMulai ? date < tanggalMulai : false}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Catatan */}
                        <div className="space-y-2">
                            <Label htmlFor="catatan">
                                Catatan Kepala Program Studi
                            </Label>
                            <Textarea
                                id="catatan"
                                placeholder="Masukkan catatan (wajib jika menolak)"
                                value={formData.catatan}
                                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                                rows={4}
                            />
                            <p className="text-xs text-gray-500">Catatan wajib diisi jika menolak pengajuan</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleCloseModal}
                            disabled={loadingSubmit}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleReject}
                            disabled={loadingSubmit}
                        >
                            {loadingSubmit ? "Memproses..." : "✕ Tolak"}
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleApprove}
                            disabled={loadingSubmit}
                        >
                            {loadingSubmit ? "Memproses..." : "✓ Setujui"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}