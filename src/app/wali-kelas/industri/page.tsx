"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react"

export default function IndustriListWaliKelas() {
    // Mock Data
    const industries = Array(5).fill({
        id: 1,
        name: "JV Partner Indonesia",
        studentCount: 6,
        image: "/placeholder-building.jpg"
    }).map((item, i) => ({ ...item, id: i + 1 }))

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Industri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {industries.map((industry) => (
                        <div key={industry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={industry.image} />
                                    <AvatarFallback><Building2 className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-lg">{industry.name}</div>
                                    <div className="text-sm text-muted-foreground">{industry.studentCount} Anak</div>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200" asChild>
                                <Link href={`/wali-kelas/industri/${industry.id}`}>
                                    Lihat
                                </Link>
                            </Button>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan 1-3 dari 7 Permohonan
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" disabled>
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
