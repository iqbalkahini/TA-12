"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

export default function PembimbingListWaliKelas() {
    // Mock Data based on design
    const pembimbings = [
        {
            id: 1,
            name: "Lestari Dewi, S.Pd.",
            company: "PT. Cipta Karya Teknologi",
            image: "/placeholder-teacher-1.jpg"
        },
        {
            id: 2,
            name: "Andi Pratama, Drs.",
            company: "CV. Mitra Sejahtera",
            image: "/placeholder-teacher-2.jpg"
        },
        {
            id: 3,
            name: "Rudi Hartono, M.Pd.",
            company: "PT. Indo Kreatif Media",
            image: "/placeholder-teacher-3.jpg"
        },
        {
            id: 4,
            name: "Nur Aini, S.Kom.",
            company: "CV. Sentosa Mandiri",
            image: "/placeholder-teacher-4.jpg"
        },
        {
            id: 5,
            name: "Dimas Saputra, M.T.",
            company: "PT. Nusantara Digital",
            image: "/placeholder-teacher-5.jpg"
        },
        {
            id: 6,
            name: "Siti Rahmawati, S.Pd.",
            company: "PT. Maju Bersama Industri",
            image: "/placeholder-teacher-6.jpg"
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Guru Pembimbing PKL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pembimbings.map((pembimbing) => (
                        <div key={pembimbing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-pink-100">
                                    <AvatarImage src={pembimbing.image} />
                                    <AvatarFallback><User className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-lg">{pembimbing.name}</div>
                                    <div className="text-sm text-muted-foreground">{pembimbing.company}</div>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200" asChild>
                                <Link href={`/wali-kelas/pembimbing/${pembimbing.id}`}>
                                    Lihat
                                </Link>
                            </Button>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan 1-3 dari 7 laman guru pembimbing.
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="default" size="sm" className="bg-[#5f2a2a] hover:bg-[#4a2020]">
                                01
                            </Button>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
