"use client"

import { useJurusanSiswaLogin, useKelasDataSiswaLogin, useSiswaDataLogin, useSiswaPengajuanData } from "@/hooks/useSiswaData";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getIndustriById } from "@/api/admin/industri";
import { DataPengajuan } from "@/types/api";
import { Calendar, Building2, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface PermohonanCardProps {
    permohonan: DataPengajuan;
}

function PermohonanCard({ permohonan }: PermohonanCardProps) {
    const [namaIndustri, setNamaIndustri] = useState<string>("Loading...");

    useEffect(() => {
        const fetchIndustri = async () => {
            try {
                const response = await getIndustriById(permohonan.industri_id);
                if (response && response.data) {
                    setNamaIndustri(response.data.nama);
                }
            } catch (error) {
                console.error("Error fetching industri:", error);
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
                        <p className="text-xs text-gray-500 mt-1">ID Permohonan: #{permohonan.id}</p>
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
    const { siswa } = useSiswaDataLogin()
    const { kelas } = useKelasDataSiswaLogin()
    const { jurusan } = useJurusanSiswaLogin()
    const { dataPengajuan } = useSiswaPengajuanData()

    console.log(dataPengajuan)

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Notification */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <p>
                    Batas waktu pendaftaran PKL semakin dekat. Pastikan Anda mengirimkan aplikasi
                    Anda sebelum <strong>15 Maret 2024</strong>.
                </p>
            </div>

            {/* Profile & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                {
                    siswa && (
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

                                <div className="text-gray-500">Jurusan</div>
                                <div className="font-medium">{jurusan?.nama}</div>
                            </div>
                        </div>
                    )
                }

                {/* Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Status Magang</h2>
                    <p className="text-sm text-gray-500 mb-6">Status Permohonan Saat Ini</p>

                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl text-sm">
                        <p className="font-medium">Menunggu Persetujuan</p>
                    </div>

                    <div className="mt-6 text-sm space-y-2">
                        <p className="font-medium">Garis Waktu Permohonan :</p>
                        <div className="flex justify-between">
                            <span className="text-green-600 font-medium">● Permohonan Telah Dikirim</span>
                            <span>Mar 10, 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-yellow-600 font-medium">● Sedang Ditinjau</span>
                            <span>Saat ini</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">● Keputusan Persetujuan</span>
                            <span>Tertunda</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Permohonan Baru
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Unggah Document
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Lihat Jadwal
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Kontak Pembimbing
                </button>
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