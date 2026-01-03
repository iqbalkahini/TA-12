"use client"

import { StatisticsCard } from "@/components/statistics-card"
import { GraduationCap, Building2, Users } from "lucide-react"
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

    const notifications = [
        {
            id: 1,
            user: {
                name: "Park Jhokuwie",
                role: "XII RPL 1 • PT. Teknologi Maju",
                image: "/placeholder-user.jpg"
            },
            action: "Mengadukan Masalah",
            status: "Menunggu",
            date: "2 jam yang lalu",
            type: "issue"
        },
        {
            id: 2,
            user: {
                name: "Kim Shareonni",
                role: "XII TKJ 2 • CV. Solusi Digital",
                image: "/placeholder-user.jpg"
            },
            action: "Mengadukan Masalah",
            status: "Disetujui",
            date: "1 hari yang lalu",
            type: "issue"
        },
        {
            id: 3,
            user: {
                name: "Lee Bhouwo",
                role: "XII MM 1 • Bank Mandiri",
                image: "/placeholder-user.jpg"
            },
            action: "Mengadukan Masalah",
            status: "Ditolak",
            date: "2 hari yang lalu",
            type: "issue"
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

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">Notifikasi</CardTitle>
                    <Link href="/wali-kelas/permasalahan" className="text-sm text-muted-foreground hover:underline">
                        Lihat Semua
                    </Link>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={notif.user.image} alt={notif.user.name} />
                                    <AvatarFallback>{notif.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {notif.user.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {notif.user.role} <span className="mx-1">|</span> <span className="text-red-500 font-medium">{notif.action}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusVariant(notif.status) as any} className="capitalize">
                                    {notif.status}
                                </Badge>
                                <Button size="sm" variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none" asChild>
                                    <Link href={`/wali-kelas/permasalahan/${notif.id}`}>
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
