'use client'

import { dashboardKapro } from "@/api/kapro/indext";
import { Spinner } from "@/components/ui/spinner";
import { DashboardKaprogData } from "@/types/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardAdminPKL = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [dataDashboardKapro, setDataDashboardKapro] = useState<DashboardKaprogData | null>(null);
    const [pklFilter, setPklFilter] = useState<string>("semua");
    const [pindahFilter, setPindahFilter] = useState<string>("semua");

    useEffect(() => {
        async function fetchDashboardKapro() {
            try {
                const pklStatuses = pklFilter === "all" ? undefined : [pklFilter as any];
                const pindahStatuses = pindahFilter === "all" ? undefined : [pindahFilter as any];
                const response = await dashboardKapro(pklStatuses, pindahStatuses);
                if (!response) {
                    setDataDashboardKapro(null);
                } else {
                    setDataDashboardKapro(response.data);
                }
            } catch (error) {
                setDataDashboardKapro(null);
                console.error("Error fetching dashboard kapro:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardKapro();
    }, [pklFilter, pindahFilter]);

    if (loading) {
        return <Spinner className="absolute top-1/2 left-1/2 w-7 h-7" />
    }

    return (
        <div className="min-h-screen bg-[#f4f4f4] p-10 font-inter">

            {/* ===== TOP SUMMARY ===== */}
            <div className="grid grid-cols-4 gap-6 mb-9">

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Total Siswa PKL
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">{dataDashboardKapro?.summary?.total_siswa_pkl || 0}</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-indigo-100 flex items-center justify-center">
                        👥
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Pengajuan PKL Disetujui
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">{dataDashboardKapro?.summary?.total_pengajuan_pkl_disetujui || 0}</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-green-100 flex items-center justify-center">
                        ✔
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Menunggu Persetujuan
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">{dataDashboardKapro?.summary?.total_pengajuan_pkl_menunggu || 0}</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-yellow-100 flex items-center justify-center">
                        ⏳
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Tempat Magang
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">{dataDashboardKapro?.summary?.total_tempat_magang || 0}</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-red-100 flex items-center justify-center">
                        🏢
                    </div>
                </div>

            </div>

            {/* ===== MAIN SECTION ===== */}
            <div className="grid grid-cols-2 gap-8">

                <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_#e5e5e5]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold">
                            Pengajuan PKL Terbaru
                        </h3>
                        <select
                            value={pklFilter}
                            onChange={(e) => setPklFilter(e.target.value)}
                            className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 px-3 py-1.5"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Tertunda</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                            <option value="completed">Selesai</option>
                        </select>
                    </div>

                    <div className="h-px bg-gray-200 mb-5"></div>

                    {dataDashboardKapro?.pkl_pengajuan_terbaru && dataDashboardKapro.pkl_pengajuan_terbaru.length > 0 ? dataDashboardKapro.pkl_pengajuan_terbaru.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl px-5 py-4 mb-4 flex justify-between items-center"
                        >
                            <div>
                                <h5 className="text-sm font-semibold mb-1">
                                    {item.siswa_nama}
                                </h5>
                                <span className="text-xs text-gray-500">
                                    NISN: {item.siswa_nisn}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Link href="/kapro/pengajuan-pkl">
                                    <button className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white font-medium">
                                        Lihat Detail
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="text-sm text-gray-500 text-center py-4">Tidak ada pengajuan PKL</div>
                    )}

                    {dataDashboardKapro?.pkl_pengajuan_terbaru && dataDashboardKapro.pkl_pengajuan_terbaru.length > 0 && (
                        <Link href="/kapro/pengajuan-pkl">
                            <div className="text-center mt-4 text-sm text-red-800 font-medium cursor-pointer">
                                Lihat Semua Pengajuan →
                            </div>
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_#e5e5e5]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-semibold">
                            Pengajuan Pindah PKL Terbaru
                        </h3>
                        <select
                            value={pindahFilter}
                            onChange={(e) => setPindahFilter(e.target.value)}
                            className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 px-3 py-1.5"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending_pembimbing">Pembimbing Tertunda</option>
                            <option value="pending_kaprog">Kaprog Tertunda</option>
                            <option value="pending_koordinator">Koordinator Tertunda</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>

                    <div className="h-px bg-gray-200 mb-5"></div>

                    {dataDashboardKapro?.pindah_pkl_pengajuan_terbaru && dataDashboardKapro.pindah_pkl_pengajuan_terbaru.length > 0 ? dataDashboardKapro.pindah_pkl_pengajuan_terbaru.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl px-5 py-4 mb-4 flex justify-between items-center"
                        >
                            <div>
                                <h5 className="text-sm font-semibold mb-1">
                                    {item.siswa?.nama_lengkap || item.siswa?.username || "Siswa"}
                                </h5>
                                <span className="text-xs text-gray-500">
                                    {item.industri_lama?.nama || "Industri Lama"} → {item.industri_baru?.nama || "Industri Baru"}
                                </span>
                            </div>

                            <Link href="/kapro/pindah-pkl">
                                <button className="text-xs px-3 py-1.5 rounded-md bg-red-900 text-white font-medium">
                                    Lihat Detail
                                </button>
                            </Link>
                        </div>
                    )) : (
                        <div className="text-sm text-gray-500 text-center py-4">Tidak ada pengajuan pindah PKL</div>
                    )}

                    <Link href="/kapro/pindah-pkl">
                        <div className="text-center mt-4 text-sm text-red-800 font-medium cursor-pointer">
                            Lihat Semua Pengajuan Pindah PKL →
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DashboardAdminPKL;
