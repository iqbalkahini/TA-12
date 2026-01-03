"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function PermasalahanDetailWaliKelas({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detail Permasalahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Nama Peserta Didik</Label>
                        <Input value="Iqbal Lazuardi" readOnly className="bg-muted/10" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Input value="Kelas 12" readOnly className="bg-muted/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Jurusan</Label>
                            <Input value="Rekayasa Perangkat Lunak" readOnly className="bg-muted/10" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Tanggal Pengaduan</Label>
                            <Input value="27/11/2025" readOnly className="bg-muted/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Industri</Label>
                            <Input value="UBIG" readOnly className="bg-muted/10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Nama Peserta Didik</Label> {/* Design says this, but it's clearly description */}
                        <Textarea
                            value="Saya merasa tidak betah berada di indsutri"
                            readOnly
                            className="bg-muted/10 min-h-[150px]"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
