"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { User } from "lucide-react"
import Image from "next/image"

export default function IndustriDetailWaliKelas({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detail Industri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Top Section: Info */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <div className="aspect-square relative rounded-xl overflow-hidden border">
                                {/* Placeholder for Industry Image */}
                                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">Industry Image</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Industri</Label>
                                <Input value="JV Partner Indonesia" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Kontak</Label>
                                <Input value="Pak Toni - +62 812 0000 0000" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Alamat</Label>
                                <Input value="Jl. Danau toba, No.14" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input value="01/09/2025" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Bidang</Label>
                                <Input value="Design" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Akhir</Label>
                                <Input value="31/12/2025" readOnly />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Student List */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#C15806] flex items-center gap-2">
                            <span className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#C15806] border-b-[6px] border-b-transparent"></span>
                            Daftar Peserta PKL
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarImage src={`/placeholder-student-${i}.jpg`} />
                                            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">Park Jhokuwie</div>
                                            <div className="text-sm text-muted-foreground">XII RPL 1</div>
                                        </div>
                                    </div>
                                    <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200" asChild>
                                        <Link href={`/wali-kelas/siswa/${i}`}>
                                            Periksa
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
