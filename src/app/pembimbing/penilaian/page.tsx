"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  FileEdit,
  FileCheck,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cetakPenilaian, pembimbingPenilaianApi } from "@/api/penilaian";
import {
  StudentApplicationItem,
  PenilaianApplicationDetail,
  DraftPenilaianPayload,
  SertifikatPKL,
  LaporanPKL,
} from "@/types/penilaian";
import { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { downloadPDF } from "@/api/files";
import { ApiResponseSekolah, SiswaDataPembimbing } from "@/types/api";
import { getSekolah } from "@/api/public";
import { getSiswa } from "@/api/pembimbing";
import { getSiswaById } from "@/api/admin/siswa";
import { getKelasById } from "@/api/admin/kelas";
import { getJurusanById } from "@/api/admin/jurusan";
import { getCurrentUser } from "@/utils/auth";
import { getIndustriById } from "@/api/admin/industri";
import deskripsiSkor from "@/utils/skor";

export default function PembimbingPenilaianPage() {
  const nomorIdentifierOptions = [
    { value: "nip", label: "NIP" },
    { value: "nik", label: "NIK" },
    { value: "nuptk", label: "NUPTK" },
    { value: "nomor_pegawai", label: "Nomor Pegawai" },
  ];

  const [students, setStudents] = useState<StudentApplicationItem[]>([]);
  const [sekolah, setSekolah] = useState<ApiResponseSekolah | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active Assessment State
  const [activeStudent, setActiveStudent] =
    useState<StudentApplicationItem | null>(null);
  const [detailData, setDetailData] =
    useState<PenilaianApplicationDetail | null>(null);

  // Local Form States
  const [scores, setScores] = useState<Record<number, number | "">>({});
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [catatanAkhir, setCatatanAkhir] = useState("");
  const [namaPimpinan, setNamaPimpinan] = useState("");
  const [jenisNomorPimpinan, setJenisNomorPimpinan] = useState("nip");
  const [nipPimpinan, setNipPimpinan] = useState("");
  const [jabatanPimpinan, setJabatanPimpinan] = useState("");
  const [namaPembimbingReq, setNamaPembimbingReq] = useState("");
  const [jenisNomorPembimbing, setJenisNomorPembimbing] = useState("nip");
  const [nipPembimbing, setNipPembimbing] = useState("");
  const [jabatanPembimbing, setJabatanPembimbing] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "belum_dinilai" | "sudah_dinilai" | "semua"
  >("semua");

  useEffect(() => {
    fetchStudents();
  }, [filterStatus, searchQuery]);

  useEffect(() => {
    fetchSekolah();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingList(true);
      // Adjust limit as necessary or implement pagination
      const res = await pembimbingPenilaianApi.getStudents(
        1,
        100,
        false,
        filterStatus,
        searchQuery,
      );
      setStudents(res.data || []);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      toast.error("Gagal memuat daftar siswa bimbingan.");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchSekolah = async () => {
    try {
      const res = await getSekolah();
      setSekolah(res || null);
    } catch (error) {
      console.error("Gagal mengambil data sekolah:", error);
      toast.error("Gagal memuat data sekolah.");
    }
  };

  const handleOpenPenilaian = async (student: StudentApplicationItem) => {
    setActiveStudent(student);
    setIsModalOpen(true);
    setLoadingDetail(true);
    setDetailData(null);

    // Reset local states
    setScores({});
    setDescriptions({});
    setCatatanAkhir("");
    setNamaPimpinan("");
    setJenisNomorPimpinan("nip");
    setNipPimpinan("");
    setJabatanPimpinan("");
    setNamaPembimbingReq("");
    setJenisNomorPembimbing("nip");
    setNipPembimbing("");
    setJabatanPembimbing("");

    // Load from local storage if exists
    const storedSertifikatStr = localStorage.getItem(
      `sertifikat_data_${student.siswa_id}`,
    );
    if (storedSertifikatStr) {
      try {
        const storedSertifikat = JSON.parse(storedSertifikatStr);
        setNamaPimpinan(storedSertifikat.nama_pimpinan || "");
        setJenisNomorPimpinan(storedSertifikat.jenis_nomor_pimpinan || "nip");
        setNipPimpinan(storedSertifikat.nip_pimpinan || "");
        setJabatanPimpinan(storedSertifikat.jabatan_pimpinan || "");
        setNamaPembimbingReq(storedSertifikat.nama_pembimbing || "");
        setJenisNomorPembimbing(
          storedSertifikat.jenis_nomor_pembimbing || "nip",
        );
        setNipPembimbing(storedSertifikat.nip_pembimbing || "");
        setJabatanPembimbing(storedSertifikat.jabatan_pembimbing || "");
      } catch (err) {
        console.error("Format local storage sertifikat data invalid");
      }
    }

    try {
      const detail = await pembimbingPenilaianApi.getApplicationDetail(
        student.application_id,
      );
      setDetailData(detail);

      // Pre-fill form if data exists
      if (detail.items && detail.items.length > 0) {
        const initScores: Record<number, number | ""> = {};
        const initDescs: Record<number, string> = {};

        detail.items.forEach((item) => {
          initScores[item.form_item_id] = item.skor;
          initDescs[item.form_item_id] = item.deskripsi || "";
        });

        setScores(initScores);
        setDescriptions(initDescs);
        setCatatanAkhir(detail.catatan_akhir || "");
      } else {
        // Initialize empty state based on form_items
        const initScores: Record<number, number | ""> = {};
        const initDescs: Record<number, string> = {};
        detail.form_items?.forEach((fi) => {
          initScores[fi.id] = "";
          initDescs[fi.id] = "";
        });
        setScores(initScores);
        setDescriptions(initDescs);
      }
    } catch (error) {
      console.error("Gagal mengambil detail form penilaian:", error);
      toast.error("Gagal memuat detail lembar penilaian.");
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sudah_dinilai":
      case "final":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1 text-white">
            <CheckCircle2 className="h-3 w-3" /> Sudah Dinilai
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 gap-1 text-white">
            <Save className="h-3 w-3" /> Draft
          </Badge>
        );
      default:
        // belum dinilai
        return (
          <Badge variant="secondary" className="gap-1 border">
            <Clock className="h-3 w-3" /> Belum Dinilai
          </Badge>
        );
    }
  };

  const filteredStudents = students;

  const getNomorLabel = (jenisNomor: string) =>
    nomorIdentifierOptions.find((option) => option.value === jenisNomor)
      ?.label || "Nomor";

  const canPrintPenilaian =
    detailData?.status === "sudah_dinilai" || detailData?.status === "final";

  const formatTanggalIndonesia = (tanggal?: string | null) => {
    if (!tanggal) return "-";

    const parsedDate = new Date(tanggal);
    if (Number.isNaN(parsedDate.getTime())) return tanggal;

    return parsedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPayload = (): DraftPenilaianPayload => {
    if (!detailData) return { items: [] };

    const items = detailData.form_items.map((fi, i) => {
      const skorValue =
        typeof scores[fi.id] === "number" ? (scores[fi.id] as number) : 0;
      // Generate the deskripsi dynamically based on the current score and index
      const deskripsi = deskripsiSkor(i + 1, skorValue);

      return {
        form_item_id: fi.id,
        skor: skorValue,
        deskripsi: deskripsi,
      };
    });

    // Filter out items that have no score inputted if it's draft, or just send all
    // Let backend validate. We'll only send valid items to avoid 0 if user just left it empty
    const filteredItems = items.filter((i) => i.skor > 0);

    return {
      items: filteredItems,
      catatan_akhir: catatanAkhir,
    };
  };

  const handleSaveDraft = async () => {
    if (!detailData || !activeStudent) return;
    const payload = getPayload();

    if (payload.items.length === 0) {
      toast.error("Minimal satu skor item harus diisi untuk draft.");
      return;
    }

    try {
      setSubmitting(true);

      // Simpan ke local storage
      localStorage.setItem(
        `sertifikat_data_${activeStudent.siswa_id}`,
        JSON.stringify({
          nama_pimpinan: namaPimpinan,
          jenis_nomor_pimpinan: jenisNomorPimpinan,
          nip_pimpinan: nipPimpinan,
          jabatan_pimpinan: jabatanPimpinan,
          nama_pembimbing: namaPembimbingReq,
          jenis_nomor_pembimbing: jenisNomorPembimbing,
          nip_pembimbing: nipPembimbing,
          jabatan_pembimbing: jabatanPembimbing,
        }),
      );

      await pembimbingPenilaianApi.saveDraft(
        activeStudent.application_id,
        payload,
      );
      toast.success("Draft penilaian berhasil disimpan!");
      fetchStudents();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat menyimpan draft.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (!detailData || !activeStudent) return;

    // Validate if all items are filled before finalize
    const allFilled = detailData.form_items.every((fi) => {
      const s = scores[fi.id];
      return typeof s === "number" && s > 0;
    });

    if (!allFilled) {
      toast.error("Semua skor harus diisi sebelum melakukan finalisasi.");
      return;
    }

    if (!catatanAkhir.trim()) {
      toast.error("Catatan akhir harus diisi sebelum melakukan finalisasi.");
      return;
    }

    if (
      !confirm(
        "Plai yang sudah difinalisasi TIDAK DAPAT DIUBAH lagi. Anda yakin?",
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      Object.keys(scores).forEach((key, i) => {
        const id = parseInt(key);
        const deskripsi = deskripsiSkor(i + 1, scores[id] as number);
        setDescriptions((prev) => ({
          ...prev,
          [id]: deskripsi,
        }));
        if (!scores[id]) {
          scores[id] = 0;
        }
      });
      // Simpan ke local storage
      localStorage.setItem(
        `sertifikat_data_${activeStudent.siswa_id}`,
        JSON.stringify({
          nama_pimpinan: namaPimpinan,
          jenis_nomor_pimpinan: jenisNomorPimpinan,
          nip_pimpinan: nipPimpinan,
          jabatan_pimpinan: jabatanPimpinan,
          nama_pembimbing: namaPembimbingReq,
          jenis_nomor_pembimbing: jenisNomorPembimbing,
          nip_pembimbing: nipPembimbing,
          jabatan_pembimbing: jabatanPembimbing,
        }),
      );

      // 1. Simpan draft secara penuh terlebih dahulu agar datanya utuh di backend
      console.log(getPayload());
      await pembimbingPenilaianApi.saveDraft(
        activeStudent.application_id,
        getPayload(),
      );

      // 2. Lakukan Finalisasi
      await pembimbingPenilaianApi.finalizeScore(activeStudent.application_id);

      toast.success("Penilaian berhasil difinalisasi!");
      fetchStudents();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat melakukan finalisasi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const cetakSuratPenilaian = async (data: LaporanPKL) => {
    try {
      setLoading(true);
      const res = await cetakPenilaian(data);
      const download = await downloadPDF(res.filename);
      toast.success("Surat penilaian berhasil dicetak!");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat mencetak surat penilaian.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Penilaian Siswa</h1>
          <p className="text-muted-foreground mt-1">
            Kelola dan Masukan nilai praktik kerja lapangan (PKL) siswa
            bimbingan Anda.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa Bimbingan</CardTitle>
          <CardDescription>
            Pilih siswa untuk memasukkan nilai PKL berdasarkan indikator yang
            disusun oleh Koordinator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari nama atau NISN siswa..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchQuery(searchInput);
                    }
                  }}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setSearchQuery(searchInput)}
              >
                Cari
              </Button>
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(
                  value as "belum_dinilai" | "sudah_dinilai" | "semua",
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="belum_dinilai">Belum Dinilai</SelectItem>
                  <SelectItem value="sudah_dinilai">Sudah Dinilai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead className="w-[200px] whitespace-nowrap">
                    Nama & NISN
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Kelas</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Industri / Tempat PKL
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Memuat data siswa...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.application_id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {student.siswa_username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.siswa_nisn}
                        </div>
                      </TableCell>
                      <TableCell>{student.kelas_nama}</TableCell>
                      <TableCell>{student.industri_nama}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(student.penilaian_status)}
                      </TableCell>
                      <TableCell className="text-right flex">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900"
                          onClick={() => handleOpenPenilaian(student)}
                        >
                          {student.penilaian_status === "sudah_dinilai" ||
                          student.penilaian_status === "final" ? (
                            <>
                              <FileCheck className="h-4 w-4" /> Buka Detail
                            </>
                          ) : (
                            <>
                              <FileEdit className="h-4 w-4" /> Masukan Nilai
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Data siswa tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL PENILAIAN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="p-6 pb-4 border-b">
            <DialogTitle className="text-xl">
              Lembar Penilaian: {activeStudent?.siswa_username}
            </DialogTitle>
            <DialogDescription className="mt-2 flex justify-end">
              {/* {detailData ? getStatusBadge(detailData.status) : "-"} */}
              {canPrintPenilaian && (
                <Button
                  onClick={async () => {
                    if (!activeStudent || !detailData) {
                      toast.error("Data siswa atau penilaian tidak lengkap");
                      return;
                    }

                    if (
                      !(
                        detailData.status === "sudah_dinilai" ||
                        detailData.status === "final"
                      )
                    ) {
                      toast.error(
                        "Penilaian hanya bisa dicetak untuk siswa yang sudah dinilai.",
                      );
                      return;
                    }

                    const fi = detailData.form_items || [];

                    // Helper to safely get score
                    const getScore = (index: number) => {
                      if (!fi[index]) return 0;
                      const val = scores[fi[index].id];
                      return typeof val === "number" ? val : 0;
                    };

                    // Helper to safely get desc
                    const getDesc = (index: number) => {
                      if (!fi[index]) return "-";
                      return descriptions[fi[index].id] || "-";
                    };

                    let tanggalMulaiRaw =
                      activeStudent.tanggal_mulai ||
                      detailData.tanggal_mulai ||
                      null;
                    let tanggalSelesaiRaw =
                      activeStudent.tanggal_selesai ||
                      detailData.tanggal_selesai ||
                      null;

                    if (!tanggalMulaiRaw || !tanggalSelesaiRaw) {
                      try {
                        const siswaRes = await getSiswa();
                        console.log(siswaRes);
                        // const siswaData = Array.isArray(siswaRes?.data)
                        //     ? siswaRes.data
                        //     : (Array.isArray(siswaRes) ? siswaRes : []);
                        // const activeSiswaDetail = siswaData.find(
                        //     (s: SiswaDataPembimbing) =>
                        //         s.application_id === activeStudent.application_id ||
                        //         s.siswa_id === activeStudent.siswa_id
                        // );

                        // tanggalMulaiRaw = activeSiswaDetail?.tanggal_mulai || tanggalMulaiRaw;
                        // tanggalSelesaiRaw = activeSiswaDetail?.tanggal_selesai || tanggalSelesaiRaw;
                      } catch (error) {
                        console.error(
                          "Gagal mengambil tanggal PKL dari getSiswa:",
                          error,
                        );
                      }
                    }

                    const tglMulaiVal = formatTanggalIndonesia(tanggalMulaiRaw);
                    const tglSelesaiVal =
                      formatTanggalIndonesia(tanggalSelesaiRaw);

                    // Fetch Konsentrasi Keahlian (Jurusan) via Siswa -> Kelas -> Jurusan
                    let konsentrasiKeahlianVal = "-";
                    try {
                      const siswaRes = await getSiswaById(
                        activeStudent.siswa_id,
                      );
                      if (siswaRes && siswaRes.data && siswaRes.data.kelas_id) {
                        const kelasRes = await getKelasById(
                          siswaRes.data.kelas_id,
                        );
                        if (
                          kelasRes &&
                          kelasRes.data &&
                          kelasRes.data.jurusan_id
                        ) {
                          const jurusanRes = await getJurusanById(
                            kelasRes.data.jurusan_id,
                          );
                          if (
                            jurusanRes &&
                            jurusanRes.data &&
                            jurusanRes.data.nama
                          ) {
                            konsentrasiKeahlianVal = jurusanRes.data.nama;
                          }
                        }
                      }
                    } catch (err) {
                      console.error(
                        "Failed to fetch konsentrasi keahlian",
                        err,
                      );
                    }

                    // Fetch industri for PIC
                    let namaInstrukturVal = "-";
                    try {
                      const industriRes = await getIndustriById(
                        activeStudent.industri_id,
                      );
                      if (
                        industriRes &&
                        industriRes.data &&
                        industriRes.data.pic
                      ) {
                        namaInstrukturVal = industriRes.data.pic;
                      }
                    } catch (err) {
                      console.error("Failed to fetch industri PIC", err);
                    }

                    const currentUserInfo = JSON.parse(
                      localStorage.getItem("guruData") || "{}",
                    );
                    const namaPembimbingVal = currentUserInfo?.nama || "-";
                    const storedSertifikatStr = localStorage.getItem(
                      `sertifikat_data_${activeStudent.siswa_id}`,
                    );
                    let jenisNomorCetak = "NIP";
                    let jabatanInstrukturVal = "-";
                    let nomorInstrukturVal = "-";
                    let jabatanPembimbingVal = "-";
                    let nomorPembimbingVal = "-";

                    if (storedSertifikatStr) {
                      try {
                        const storedSertifikat =
                          JSON.parse(storedSertifikatStr);
                        const selectedJenisNomor =
                          storedSertifikat.jenis_nomor_pembimbing ||
                          storedSertifikat.jenis_nomor_pimpinan ||
                          "nip";

                        jenisNomorCetak = getNomorLabel(selectedJenisNomor);
                        jabatanInstrukturVal =
                          storedSertifikat.jabatan_pimpinan || "-";
                        nomorInstrukturVal =
                          storedSertifikat.nip_pimpinan || "-";
                        jabatanPembimbingVal =
                          storedSertifikat.jabatan_pembimbing || "-";
                        nomorPembimbingVal =
                          storedSertifikat.nip_pembimbing || "-";
                      } catch (error) {
                        console.error(
                          "Gagal membaca jenis nomor dari localStorage:",
                          error,
                        );
                      }
                    }

                    cetakSuratPenilaian({
                      school_info: {
                        nama_sekolah:
                          sekolah?.data.nama_sekolah || "SMKN 2 SINGOSARI",
                        alamat_jalan:
                          sekolah?.data.jalan || "Jl. Raya Perusahaan No.20",
                        kelurahan: sekolah?.data.kelurahan || "Tanjungtirto",
                        kecamatan: sekolah?.data.kecamatan || "Singosari",
                        kab_kota: sekolah?.data.kabupaten_kota || "",
                        provinsi: "",
                        kode_pos: sekolah?.data.kode_pos || "",
                        telepon:
                          sekolah?.data.nomor_telepon || "(0341) 4345127",
                        email:
                          sekolah?.data.email || "smkn2.singosari@yahoo.co.id",
                        website:
                          sekolah?.data.website ||
                          "https://smkn2-singosari.sch.id/",
                        logo_url:
                          sekolah?.data.logo_url ||
                          "https://upload.wikimedia.org/wikipedia/commons/7/74/Coat_of_arms_of_East_Java.svg",
                      },
                      siswa: {
                        nama: activeStudent.siswa_username || "-",
                        nisn: activeStudent.siswa_nisn || "-",
                        kelas: activeStudent.kelas_nama || "-",
                        konsentrasi_keahlian: konsentrasiKeahlianVal,
                        tempat_pkl: activeStudent.industri_nama || "-",
                        tanggal_mulai: tglMulaiVal,
                        tanggal_selesai: tglSelesaiVal,
                        nama_instruktur: namaInstrukturVal,
                        jabatan_instruktur: jabatanInstrukturVal,
                        nip_instruktur: nomorInstrukturVal,
                        nama_pembimbing: namaPembimbingVal,
                        jabatan_pembimbing: jabatanPembimbingVal,
                        nip_pembimbing: nomorPembimbingVal,
                      },
                      nilai: {
                        skor_1: getScore(0),
                        desc_1: getDesc(0),
                        skor_2: getScore(1),
                        desc_2: getDesc(1),
                        skor_3: getScore(2),
                        desc_3: getDesc(2),
                        skor_4: getScore(3),
                        desc_4: getDesc(3),
                      },
                      jenis_nomor: jenisNomorCetak,
                      sakit: 0,
                      izin: 0,
                      alpa: 0,
                      tempat_tanggal: `${sekolah?.data.kabupaten_kota || "Tempat"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
                    });
                  }}
                  disabled={loading}
                >
                  Cetak Penilaian
                </Button>
              )}
            </DialogDescription>
          </div>

          <div className="p-6 overflow-y-auto max-h-full">
            {loadingDetail ? (
              <div className="py-12 text-center text-muted-foreground">
                Memuat formulir penilaian...
              </div>
            ) : detailData ? (
              <div className="space-y-6 pr-2">
                <div className="bg-muted/40 p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between border">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Siswa
                    </span>
                    <span className="font-medium">
                      {activeStudent?.siswa_username} (
                      {activeStudent?.siswa_nisn})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Industri
                    </span>
                    <span className="font-medium">
                      {activeStudent?.industri_nama}
                    </span>
                  </div>
                  {detailData.status === "final" && (
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">
                        Nilai Akhir Akhir
                      </span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        {detailData.rata_rata}{" "}
                        {detailData.total_skor && `(${detailData.total_skor})`}
                      </span>
                    </div>
                  )}
                </div>

                {!detailData.form_items ||
                detailData.form_items.length === 0 ? (
                  <div className="text-center py-6 text-orange-500 border border-orange-200 bg-orange-50 rounded-md">
                    Formulir belum memiliki indikator. Harap hubungi
                    Koordinator.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold border-b pb-2">
                      Komponen Penilaian (Skala 0-100)
                    </h3>
                    {detailData.form_items.map((fi, idx) => (
                      <div
                        key={fi.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-md bg-card shadow-sm"
                      >
                        <div className="md:col-span-8 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                            {fi.urutan || idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-relaxed">
                              {fi.tujuan_pembelajaran}
                            </p>
                            {detailData.status === "final" &&
                              descriptions[fi.id] && (
                                <p className="mt-2 text-sm italic text-muted-foreground border-l-2 pl-2">
                                  &ldquo;{descriptions[fi.id]}&rdquo;
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="md:col-span-4 flex flex-col md:items-end justify-center">
                          <Label className="text-xs text-muted-foreground mb-1">
                            Skor (0-100)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full md:w-28 text-center text-lg font-bold"
                            value={scores[fi.id] === "" ? "" : scores[fi.id]}
                            onChange={(e) => {
                              const val = e.target.value;
                              let numVal: number | "" =
                                val === "" ? "" : Number(val);
                              if (typeof numVal === "number") {
                                if (numVal > 100) numVal = 100;
                                if (numVal < 0) numVal = 0;
                              }
                              setScores((p) => ({ ...p, [fi.id]: numVal }));
                            }}
                            disabled={detailData.status === "final"}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 pt-4 border-t space-y-4">
                      <h3 className="font-bold text-base">
                        Data Tambahan Sertifikat
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Pimpinan</Label>
                          <Input
                            value={namaPimpinan}
                            onChange={(e) => setNamaPimpinan(e.target.value)}
                            disabled={detailData.status === "final"}
                            placeholder="Masukkan Nama Pimpinan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Jenis Nomor Pimpinan</Label>
                          <Select
                            value={jenisNomorPimpinan}
                            onValueChange={setJenisNomorPimpinan}
                            disabled={detailData.status === "final"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis nomor pimpinan" />
                            </SelectTrigger>
                            <SelectContent>
                              {nomorIdentifierOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>
                            {getNomorLabel(jenisNomorPimpinan)} Pimpinan
                          </Label>
                          <Input
                            value={nipPimpinan}
                            onChange={(e) => setNipPimpinan(e.target.value)}
                            disabled={detailData.status === "final"}
                            placeholder={`Masukkan ${getNomorLabel(jenisNomorPimpinan)} Pimpinan`}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Jabatan Pimpinan</Label>
                          <Input
                            value={jabatanPimpinan}
                            onChange={(e) => setJabatanPimpinan(e.target.value)}
                            disabled={detailData.status === "final"}
                            placeholder="Masukkan Jabatan Pimpinan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nama Pembimbing</Label>
                          <Input
                            value={namaPembimbingReq}
                            onChange={(e) =>
                              setNamaPembimbingReq(e.target.value)
                            }
                            disabled={detailData.status === "final"}
                            placeholder="Masukkan Nama Pembimbing"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Jenis Nomor Pembimbing</Label>
                          <Select
                            value={jenisNomorPembimbing}
                            onValueChange={setJenisNomorPembimbing}
                            disabled={detailData.status === "final"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis nomor pembimbing" />
                            </SelectTrigger>
                            <SelectContent>
                              {nomorIdentifierOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>
                            {getNomorLabel(jenisNomorPembimbing)} Pembimbing
                          </Label>
                          <Input
                            value={nipPembimbing}
                            onChange={(e) => setNipPembimbing(e.target.value)}
                            disabled={detailData.status === "final"}
                            placeholder={`Masukkan ${getNomorLabel(jenisNomorPembimbing)} Pembimbing`}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Jabatan Pembimbing</Label>
                          <Input
                            value={jabatanPembimbing}
                            onChange={(e) =>
                              setJabatanPembimbing(e.target.value)
                            }
                            disabled={detailData.status === "final"}
                            placeholder="Masukkan Jabatan Pembimbing"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t space-y-2">
                      <Label className="font-bold text-base">
                        Catatan Akhir Pembimbing
                      </Label>
                      <Textarea
                        placeholder="Masukan catatan, evaluasi, atau performa unik siswa selama PKL..."
                        className="min-h-24 resize-none"
                        value={catatanAkhir}
                        onChange={(e) => setCatatanAkhir(e.target.value)}
                        disabled={detailData.status === "final"}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="p-4 border-t bg-muted/20 flex flex-col sm:flex-row justify-end gap-2 mt-auto">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Kembali
            </Button>

            {detailData && detailData.status !== "final" && (
              <>
                <Button
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
                  onClick={handleSaveDraft}
                  disabled={submitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Draf
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleFinalize}
                  disabled={submitting}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finalisasi Nilai
                </Button>
              </>
            )}
            {detailData && detailData.status === "final" && (
              <Badge
                variant="outline"
                className="px-4 py-2 border-green-500 text-green-600 ml-auto justify-center bg-green-50 self-end md:self-auto"
              >
                Sudah Terkunci
              </Badge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
