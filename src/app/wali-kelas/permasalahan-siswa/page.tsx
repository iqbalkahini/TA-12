"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, RotateCcw } from "lucide-react"

export default function PermasalahanListWaliKelas() {
    // Mock Data
    const issues = [
        {
            id: 1,
            user: { name: "Park Jhokuwie", role: "XII RPL 1 • PT. Teknologi Maju", image: "/placeholder-user.jpg" },
            action: "Mengadukan Masalah",
            status: "Menunggu",
        },
        {
            id: 2,
            user: { name: "Kim Shareonni", role: "XII TKJ 2 • CV. Solusi Digital", image: "/placeholder-user.jpg" },
            action: "Mengadukan Masalah",
            status: "Disetujui",
        },
        {
            id: 3,
            user: { name: "Lee Bhouwo", role: "XII MM 1 • Bank Mandiri", image: "/placeholder-user.jpg" },
            action: "Mengadukan Masalah",
            status: "Ditolak",
        },
        {
            id: 4,
            user: { name: "Lee Bhouwo", role: "XII MM 1 • Bank Mandiri", image: "/placeholder-user.jpg" },
            action: "Mengadukan Masalah",
            status: "Menunggu",
        }
    ]

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Menunggu": return "warning"
            case "Disetujui": return "success"
            case "Ditolak": return "destructive"
            default: return "secondary"
        }
    }

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Filter Pengaduan</CardTitle>
                        <Button variant="outline" className="text-sm">
                            Reset Filter <RotateCcw className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Input placeholder="Semua Status" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tanggal Pengaduan</label>
                            <Input placeholder="DD/MM/YYYY" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kelas</label>
                            <Input placeholder="Pilih Kelas" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button className="bg-[#5f2a2a] hover:bg-[#4a2020] min-w-[150px]">
                            <Search className="mr-2 h-4 w-4" /> Cari...
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* List Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Notifikasi</CardTitle>
                    <span className="text-sm text-muted-foreground">Lihat Semua</span>
                </CardHeader>
                <CardContent className="space-y-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={issue.user.image} />
                                    <AvatarFallback>{issue.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {issue.user.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {issue.user.role} <span className="mx-1">|</span> <span className="text-red-500 font-medium">{issue.action}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusVariant(issue.status) as any} className="capitalize px-4 py-1">
                                    {issue.status}
                                </Badge>
                                <Button size="sm" variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4" asChild>
                                    <Link href={`/wali-kelas/permasalahan/${issue.id}`}>
                                        Periksa
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
