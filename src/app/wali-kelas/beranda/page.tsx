"use client"

import { GraduationCap, Users, Building2, ArrowUp, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getNilaiSiswaByWaliKelas, getWaliKelasDashboard, SiswaPklSummaryDto, WaliKelasDashboardDto } from "@/api/wali-kelas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Industri, ListResponse } from "@/types/api";
import { getIndustri } from "@/api/admin/industri";

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [siswaList, setSiswaList] = useState<SiswaPklSummaryDto[]>([])
    const [kelasInfo, setKelasInfo] = useState<WaliKelasDashboardDto['kelas_info'] | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [dataIndustri, setDataIndustri] = useState<ListResponse<Industri> | null>(null)

    // Manual debounce implementation since hook might not be available
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const loadIndustri = async () => {
        try {
            const res = await getIndustri("", 1)
            if (res) {
                setDataIndustri(res.data)
            }
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat data industri")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        loadIndustri()
    }, [page, debouncedSearch])

    const loadData = async () => {
        try {
            setLoading(true)
            const res = await getWaliKelasDashboard(page, 10, debouncedSearch)
            if (res) {
                setSiswaList(res.siswa_list || [])
                setKelasInfo(res.kelas_info)
            }
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat data dashboard")
        } finally {
            setLoading(false)
        }
    }

    const exportNilai = async () => {
        try {
            setLoading(true)
            const res = await getNilaiSiswaByWaliKelas()
            if (res) {
                const url = window.URL.createObjectURL(res);

                const link = document.createElement('a');
                link.href = url;
                link.download = "penilaian-final-wali-kelas.xlsx";
                document.body.appendChild(link);
                link.click();

                // Bersihkan memory
                link.remove();
                window.URL.revokeObjectURL(url);
                toast.success("Nilai berhasil diexport")
            }
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat data nilai")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">


            {/* CONTENT */}
            <main className="p-8">
                {/* CARDS */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card
                        title="Total Siswa PKL"
                        value={kelasInfo?.total_siswa || 0}
                        info={<span className="text-green-600 text-sm flex items-center gap-1"></span>}
                        icon={GraduationCap}
                        iconStyle="bg-blue-100 text-blue-600"
                    />

                    <Card
                        title="Pembimbing PKL"
                        value='10'
                        info={<span className="text-orange-500 text-sm">Penghubung sekolah & industri</span>}
                        icon={Users}
                        iconStyle="bg-orange-100 text-orange-500"
                    />

                    <Card
                        title="Industri Partner"
                        value={dataIndustri?.total_all || 0}
                        info={<span className="text-blue-600 text-sm">Aktif bekerjasama</span>}
                        icon={Building2}
                        iconStyle="bg-gray-200 text-gray-600"
                    />
                </section>

                {/* TABLE header with dynamic class name */}
                <section className="bg-white mt-8 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <div className="grid grid-cols-2 grid-rows-1 gap-x-5 items-center">
                            <h3 className="text-lg font-semibold">Data Siswa - {kelasInfo?.nama || "Memuat..."}</h3>
                            <Button disabled={loading} onClick={() => {
                                exportNilai()
                            }}>Expor Nilai</Button>
                        </div>
                        <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            Total: {kelasInfo?.total_siswa || 0} Siswa
                        </div>
                    </div>

                    <div className="relative my-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                    </div>

                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Nama Siswa</th>
                                <th className="p-3">Nama Industri</th>
                                <th className="p-3">Pembimbing</th>
                                <th className="p-3">Status</th>
                                {/* <th className="p-3">Detail</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">Memuat data...</td>
                                </tr>
                            ) : siswaList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">Tidak ada data siswa.</td>
                                </tr>
                            ) : (
                                siswaList.map((row) => (
                                    <tr key={row.id} className="border-b text-center hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-left font-medium">{row.nama}</td>
                                        <td className="p-3">{row.industri || "-"}</td>
                                        <td className="p-3">{row.pembimbing || "-"}</td>
                                        {/* Status monitoring example data */}
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${row.status_pkl === 'Sedang PKL' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {row.status_pkl}
                                            </span>
                                        </td>
                                        {/* <td className="p-3">
                                            <div className="flex justify-center">
                                                <Link href={`/wali-kelas/siswa/${row.id}`}>
                                                    <Button size="sm">Detail</Button>
                                                </Link>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-between mt-4 text-sm">
                        <span>Menampilkan {siswaList.length} data.</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                &lt;
                            </button>
                            <span className="px-3 py-1">Halaman {page}</span>
                            <button
                                onClick={() => setPage(p => p + 1)} // Simple next logic, ideally check total pages
                                className="px-3 py-1 border rounded"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

// function Card removed from here to be modular or defined properly.
// But for now, I will keep it but fix the 'any' type in props.

interface CardProps {
    title: string;
    value: string | number;
    info: React.ReactNode;
    icon: React.ElementType;
    iconStyle: string;
}

function Card({ title, value, info, icon: Icon, iconStyle }: CardProps) {
    return (
        <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-sm">
            <div>
                <p className="text-gray-600">{title}</p>
                <h1 className="text-3xl font-bold my-2">{value}</h1>
                {info}
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconStyle}`}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    );
}

const data = []; // Removed mock data