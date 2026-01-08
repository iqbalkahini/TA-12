"use client"

import { StatisticsCard } from "@/components/statistics-card"
import { GraduationCap, Building2, Users, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DashboardWaliKelas() {
    // Mock Data for Dashboard
    const stats = [
        {
            title: "Siswa Aktif PKL",
            value: 156,
            icon: GraduationCap,
            trend: { value: 12, isPositive: true },
            description: "dari bulan lalu",
            variant: "default" as const,
        },
        {
            title: "Pembimbing PKL",
            value: 38,
            icon: Users,
            description: "Penghubung sekolah & industri",
            variant: "warning" as const, // Using warning for the orange-ish look
        },
        {
            title: "Industri Partner",
            value: 26,
            icon: Building2,
            description: "Aktif bekerjasama",
            variant: "destructive" as const, // Using destructive for red/brownish look
        }
    ]

    const industryData = [
        { id: 1, jurusan: "TKJ", jumlah: "09" },
        { id: 2, jurusan: "RPL", jumlah: "05" },
        { id: 3, jurusan: "AKL", jumlah: "01" },
        { id: 4, jurusan: "MM", jumlah: "02" },
        { id: 5, jurusan: "RPL", jumlah: "07" },
        { id: 6, jurusan: "AKL", jumlah: "06" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#5f2a2a]">MagangHub</h2>
                <p className="text-muted-foreground">Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/wali-kelas/siswa">
                    <StatisticsCard
                        title={stats[0].title}
                        value={stats[0].value}
                        icon={stats[0].icon}
                        trend={stats[0].trend}
                        description={stats[0].description}
                        variant="default"
                    />
                </Link>
                <Link href="/wali-kelas/pembimbing">
                    <StatisticsCard
                        title={stats[1].title}
                        value={stats[1].value}
                        icon={stats[1].icon}
                        description={stats[1].description}
                        variant="warning"
                    />
                </Link>
                <Link href="/wali-kelas/industri">
                    <StatisticsCard
                        title={stats[2].title}
                        value={stats[2].value}
                        icon={stats[2].icon}
                        description={stats[2].description}
                        variant="destructive"
                    />
                </Link>
            </div>

            <Card className="col-span-full">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-xl font-normal">Daftar Data Industri</CardTitle>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa]" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, email, jurusan..."
                            className="w-full py-2 pl-10 pr-4 rounded-lg border border-[#ddd] focus:outline-none focus:border-[#8b1d1d] transition-colors text-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl overflow-hidden shadow-sm border border-[#eee]">
                        <table className="w-full">
                            <thead className="bg-[#f1f1f1]">
                                <tr>
                                    <th className="p-3.5 text-left text-sm font-semibold">Nama Industri</th>
                                    <th className="p-3.5 text-left text-sm font-semibold">Email</th>
                                    <th className="p-3.5 text-left text-sm font-semibold">Jurusan</th>
                                    <th className="p-3.5 text-left text-sm font-semibold">Jumlah Siswa</th>
                                    <th className="p-3.5 text-left text-sm font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {industryData.map((item, index) => (
                                    <tr key={index} className="border-b border-[#eee] last:border-0 hover:bg-gray-50">
                                        <td className="p-3.5 text-left text-sm">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src="https://i.imgur.com/9QqMZ0p.jpg"
                                                    alt="Industri"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                JV. Partner Indonesia
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-left text-sm">jvpartner@gmail.com</td>
                                        <td className="p-3.5 text-left text-sm">
                                            <span className="bg-[#8b1d1d] text-white px-2.5 py-1 rounded-md text-xs">
                                                {item.jurusan}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-left text-sm">{item.jumlah}</td>
                                        <td className="p-3.5 text-left text-sm">
                                            <Link href={`/wali-kelas/industri/${item.id}`}>
                                                <Eye className="h-5 w-5 cursor-pointer text-gray-500 hover:text-[#8b1d1d]" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-[13px] text-[#666]">
                        <span>Menampilkan 1-3 dari 7 industri</span>
                        <div className="flex gap-1.5">
                            <button className="border border-[#ddd] bg-white px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-center">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button className="border border-[#8b1d1d] bg-[#8b1d1d] text-white px-2.5 py-1.5 rounded-md cursor-pointer">
                                01
                            </button>
                            <button className="border border-[#ddd] bg-white px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-center">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

