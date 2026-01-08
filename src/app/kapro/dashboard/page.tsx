'use client'

import { ListPermohonanPKL } from "@/api/kapro/indext";
import { Spinner } from "@/components/ui/spinner";
import { DaftarPermohonanPKL } from "@/types/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardAdminPKL = () => {
    const [dataPengajuan, setDataPengajuan] = useState<DaftarPermohonanPKL[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ListPermohonanPKL("", 3);
                if (!response) {
                    setDataPengajuan([]);
                } else {
                    setDataPengajuan(response.data);
                }
            } catch (error) {
                setDataPengajuan([]);
                console.error("Error fetching pengajuan PKL:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const stats = [
        { icon: "👥", label: "Total Siswa PKL", value: 156 },
        { icon: "✅", label: "Pengajuan PKL Disetujui", value: 142 },
        { icon: "⏳", label: "Menunggu Persetujuan PKL dan Izin", value: 8 },
        { icon: "🏢", label: "Tempat Magang", value: 45 },
    ];

    const perizinan = [
        { nama: "Maya Sari", info: "Izin Sakit – 2 hari", tanggal: "15–16 November 2024" },
        { nama: "Riko Permana", info: "Izin Keperluan Keluarga – 1 hari", tanggal: "18 November 2024" },
        { nama: "Lina Kartika", info: "Izin Ujian Sekolah – 1 hari", tanggal: "20 November 2024" },
    ];

    if (loading) {
        return <Spinner className="absolute top-1/2 left-1/2 w-7 h-7" />
    }

    console.log(dataPengajuan);

    return (
        <div className="w-full p-6 max-w-6xl mx-auto space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-2xl p-5 flex flex-col gap-2 shadow-sm bg-white"
                    >
                        <div className="text-3xl">{item.icon}</div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <h2 className="text-3xl font-semibold">{item.value}</h2>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pengajuan PKL Terbaru */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Pengajuan PKL Terbaru</h2>

                    <div className="space-y-4">
                        {dataPengajuan.length > 0 ? dataPengajuan.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
                            >
                                <div>
                                    <p className="font-semibold">{item.siswa_username}</p>
                                    <p className="text-sm text-gray-600">{item.kelas_nama} – {item.industri_nama}</p>
                                </div>

                                <div className="flex gap-2">
                                    {/* <button className="px-4 py-1 bg-green-600 text-white rounded-md text-sm">Setujui</button>
                                    <button className="px-4 py-1 bg-red-600 text-white rounded-md text-sm">Tolak</button> */}
                                </div>
                            </div>
                        )) : (
                            <div>Tidak ada pengajuan PKL</div>
                        )}

                        {
                            dataPengajuan.length > 0 && (
                                <Link href="/kapro/pengajuan-pkl" className="text-center w-full text-red-700 font-medium mt-3">
                                    Lihat Semua Pengajuan →
                                </Link>
                            )
                        }
                    </div>
                </div>

                {/* Perizinan Terbaru */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Perizinan Terbaru</h2>

                    <div className="space-y-4">
                        {perizinan.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
                            >
                                <div>
                                    <p className="font-semibold">{item.nama}</p>
                                    <p className="text-sm text-gray-600">{item.info}</p>
                                    <p className="text-xs text-gray-400">{item.tanggal}</p>
                                </div>

                                <button className="px-4 py-1 bg-red-700 text-white rounded-md text-sm">Konfirmasi</button>
                            </div>
                        ))}

                        <button className="text-center w-full text-red-700 font-medium mt-3">
                            Lihat Semua Perizinan →
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: "➕", label: "Tambah Tempat Magang" },
                        { icon: "👤", label: "Tambah Pembimbing" },
                        { icon: "📄", label: "Lihat Laporan" },
                    ].map((action, index) => (
                        <div
                            key={index}
                            className="border rounded-2xl p-6 bg-white shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition"
                        >
                            <div className="text-4xl">{action.icon}</div>
                            <p className="font-medium text-gray-700">{action.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdminPKL;
