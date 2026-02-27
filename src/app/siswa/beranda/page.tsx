"use client"

import { useJurusanSiswaLogin, useKelasDataSiswaLogin, useSiswaDataLogin, useSiswaPengajuanData } from "@/hooks/useSiswaData";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getIndustriById } from "@/api/admin/industri";
import { DataPengajuan, Guru, Industri } from "@/types/api";
import { Calendar, Building2, FileText, Clock, CheckCircle2, XCircle, AlertCircle, FileUp } from "lucide-react";

import { useRouter } from "next/navigation";
import { getActivePklBySiswa } from "@/api/siswa";
import { getGuruById } from "@/api/admin/guru";

interface PermohonanCardProps {
    permohonan: DataPengajuan;
}

function PermohonanCard({ permohonan }: PermohonanCardProps) {
    const router = useRouter()
    const [namaIndustri, setNamaIndustri] = useState<string>("Memuat...");

    useEffect(() => {
        const fetchIndustri = async () => {
            try {
                const response = await getIndustriById(permohonan.industri_id);
                if (response && response.data) {
                    setNamaIndustri(response.data.nama);
                }
            } catch (error) {
                console.error("Error Memuat data industri:", error);
                setNamaIndustri("Industri tidak ditemukan");
            }
        };
        fetchIndustri();
    }, [permohonan.industri_id]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <Clock className="w-3 h-3" />
                        Menunggu
                    </span>
                );
            case "approved":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Disetujui
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        <AlertCircle className="w-3 h-3" />
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{namaIndustri}</h3>
                    </div>
                </div>
                {getStatusBadge(permohonan.status)}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Tanggal Permohonan:</span>
                    <span className="text-xs font-medium">{formatDate(permohonan.tanggal_permohonan)}</span>
                </div>

                {permohonan.catatan && (
                    <div className="flex items-start gap-2 text-gray-600">
                        <FileText className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                            <span className="text-xs">Catatan:</span>
                            <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                                {permohonan.catatan}
                            </p>
                        </div>
                    </div>
                )}

                {permohonan.tanggal_mulai && permohonan.tanggal_selesai && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mt-2">
                        <p className="text-xs text-blue-700 font-medium mb-1">Periode PKL:</p>
                        <div className="flex gap-4 text-xs text-blue-600">
                            <span>Mulai: {formatDate(permohonan.tanggal_mulai)}</span>
                            <span>Selesai: {formatDate(permohonan.tanggal_selesai)}</span>
                        </div>
                    </div>
                )}

                {permohonan.kaprog_note && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 mt-2">
                        <p className="text-xs text-amber-700 font-medium mb-1">Catatan Kaprog:</p>
                        <p className="text-xs text-amber-600">{permohonan.kaprog_note}</p>
                    </div>
                )}

                {permohonan.decided_at && (
                    <div className="flex items-center gap-2 text-gray-600 mt-2 pt-2 border-t">
                        <span className="text-xs">Diputuskan pada:</span>
                        <span className="text-xs font-medium">{formatDate(permohonan.decided_at)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { siswa, loadingSiswa } = useSiswaDataLogin()
    const { kelas } = useKelasDataSiswaLogin()
    const { jurusan } = useJurusanSiswaLogin()
    const { dataPengajuan } = useSiswaPengajuanData()
    const [activePklData, setActivePklData] = useState<any>(null);
    const [industriActive, setIndustriActive] = useState<Industri | null>(null);
    const [guruPemimbing, setGuruPembimbing] = useState<Guru | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchActivePkl = async () => {
            setIsLoading(true);
            try {
                const response = await getActivePklBySiswa();
                console.log("Response Active PKL:", response);
                if (response) {
                    setActivePklData(response);
                }
            } catch (error) {
                console.error("Error fetching active PKL:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivePkl();
    }, []);

    useEffect(() => {
        const fetchIndustri = async () => {
            if (activePklData?.industri_id) {
                try {
                    const response = await getIndustriById(activePklData.industri_id);
                    setIndustriActive(response.data);
                } catch (error) {
                    console.error("Error fetching industri:", error);
                    setIndustriActive(null);
                }
            }
        };
        fetchIndustri();
    }, [activePklData?.industri_id]);

    useEffect(() => {
        const fetchGuruPembimbing = async () => {
            if (activePklData?.pembimbing_guru_id) {
                try {
                    const response = await getGuruById(activePklData.pembimbing_guru_id);
                    setGuruPembimbing(response.data);
                } catch (error) {
                    console.error("Error fetching guru pembimbing:", error);
                    setGuruPembimbing(null);
                }
            }
        };
        fetchGuruPembimbing();
    }, [activePklData?.pembimbing_guru_id]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Notification */}
            {/* <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <p>
                    Batas waktu pendaftaran PKL semakin dekat. Pastikan Anda mengirimkan aplikasi
                    Anda sebelum <strong>15 Maret 2024</strong>.
                </p>
            </div> */}

            {/* Profile & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                {
                    loadingSiswa ? (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">
                            <h2 className="text-lg font-semibold mb-4">Profil Peserta didik</h2>
                            <p className="text-sm text-gray-500 mb-6">Memuat...</p>
                        </div>
                    ) : siswa && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border">
                            <h2 className="text-lg font-semibold mb-4">Profil Peserta didik</h2>
                            {/* <p className="text-sm text-gray-500 mb-6">Informasi Pribadi</p>

                            <div className="flex items-center gap-4 mb-6">
                                <Image src="/logo/logo_header.png" alt="logo" width={80} height={80} />
                                <div>
                                    <p className="font-medium text-gray-800">{siswa.nama_lengkap}</p>
                                </div>
                            </div> */}

                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="text-gray-500">Nama Lengkap</div>
                                <div className="font-medium">{siswa.nama_lengkap}</div>

                                <div className="text-gray-500">NISN</div>
                                <div className="font-medium">{siswa.nisn}</div>

                                <div className="text-gray-500">Kelas</div>
                                <div className="font-medium">
                                    {kelas?.nama}
                                </div>

                                <div className="text-gray-500">Kosentrasi Keahlian</div>
                                <div className="font-medium">{jurusan?.nama}</div>
                            </div>
                        </div>
                    )
                }

                {/* Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Status Magang</h2>

                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Aktif Magang</p>
                                    <p className="mt-1">Anda saat ini sedang menjalani PKL di <span className="font-bold">Memuat...</span></p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Industri</span>
                                    <span className="font-medium text-gray-900">Memuat...</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal Mulai</span>
                                    <span className="font-medium text-gray-900">Memuat...</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal Selesai</span>
                                    <span className="font-medium text-gray-900">Memuat...</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sisa Waktu</span>
                                    <span className="font-medium text-blue-600">
                                        Memuat...
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : activePklData ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Aktif Magang</p>
                                    <p className="mt-1">Anda saat ini sedang menjalani PKL di <span className="font-bold">{industriActive?.nama || "Memuat..."}</span></p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Industri</span>
                                    <span className="font-medium text-gray-900">{industriActive?.nama || "-"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Guru Pembimbing</span>
                                    <span className="font-medium text-gray-900">{guruPemimbing?.nama || "-"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal Mulai</span>
                                    <span className="font-medium text-gray-900">{new Date(activePklData.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal Selesai</span>
                                    <span className="font-medium text-gray-900">{new Date(activePklData.tanggal_selesai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sisa Waktu</span>
                                    <span className="font-medium text-blue-600">
                                        {(() => {
                                            if (!activePklData.tanggal_selesai) return "-";
                                            const end = new Date(activePklData.tanggal_selesai);
                                            const today = new Date();
                                            const diffTime = end.getTime() - today.getTime();
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return diffDays < 0 ? "Selesai" : `${diffDays} Hari`;
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl text-sm">
                                <p className="font-medium text-center">Belum ada data magang</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Daftar Permohonan</h2>

                {
                    dataPengajuan && dataPengajuan.length > 0 ? (
                        <div className="space-y-4">
                            {dataPengajuan.map((permohonan) => (
                                <PermohonanCard key={permohonan.id} permohonan={permohonan} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-gray-500 text-sm">Belum Ada Permohonan</p>
                            <p className="text-gray-400 text-xs mt-2">
                                Buat permohonan PKL pertama Anda untuk memulai
                            </p>
                        </div>
                    )
                }

            </div>
        </div>
    );
}