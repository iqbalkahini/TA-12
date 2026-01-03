"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default function SiswaDetailWaliKelas({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Peserta didik PKL</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-8">
                        {/* Profile Image */}
                        <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                            <AvatarImage src="/placeholder-student.jpg" />
                            <AvatarFallback><User className="h-20 w-20 text-muted-foreground" /></AvatarFallback>
                        </Avatar>

                        {/* Form Fields */}
                        <div className="w-full max-w-4xl space-y-6">
                            <div className="space-y-2">
                                <Label>Nama</Label>
                                <Input value="Dhia Mirza Handhono" readOnly className="h-12" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>NISN</Label>
                                    <Input value="74827932984132" readOnly className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Telp</Label>
                                    <Input value="+62812 0000 0000" readOnly className="h-12" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Input value="XII RPL 1" readOnly className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jurusan</Label>
                                    <Input value="Rekayasa Perangkat Lunak" readOnly className="h-12" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Alamat</Label>
                                <Input value="Jl. Terkam Harimau, No. 12, RT.04, RW.05" readOnly className="h-12" />
                            </div>

                            <div className="space-y-2">
                                <Label>Industri</Label>
                                <Input value="PT. Secercah Harapan" readOnly className="h-12" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
