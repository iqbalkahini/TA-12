import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Search, CheckCircle2, Clock } from "lucide-react";

// Data dummy sesuai request user
const dummyStudents = [
    {
        id: "1",
        nama: "Ahmad Fauzi",
        nisn: "0051234567",
        kelas: "XII RPL 1",
        industri: "PT. Telkom Indonesia",
        status: "Siap Digenerate",
    },
    {
        id: "2",
        nama: "Budi Santoso",
        nisn: "0057654321",
        kelas: "XII RPL 1",
        industri: "PT. PLN (Persero)",
        status: "Menunggu Penilaian",
    },
    {
        id: "3",
        nama: "Citra Lestari",
        nisn: "0069876543",
        kelas: "XII TKJ 1",
        industri: "PT. Telkomsel",
        status: "Sudah Digenerate",
    },
    {
        id: "4",
        nama: "Dian Sastrowardoyo",
        nisn: "0061239876",
        kelas: "XII TKJ 2",
        industri: "CV. Media Tama",
        status: "Siap Digenerate",
    },
    {
        id: "5",
        nama: "Eko Prasetyo",
        nisn: "0058765432",
        kelas: "XII DKV 1",
        industri: "Studio Visi",
        status: "Menunggu Penilaian",
    },
];

export default function SertifikatPage() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Sudah Digenerate":
                return <Badge variant="success" className="gap-1 bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3" /> Sudah Digenerate</Badge>;
            case "Siap Digenerate":
                return <Badge variant="default" className="gap-1 bg-blue-500 hover:bg-blue-600"><Award className="h-3 w-3" /> Siap Digenerate</Badge>;
            case "Menunggu Penilaian":
                return <Badge variant="warning" className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-white"><Clock className="h-3 w-3 text-white" /> Menunggu Penilaian</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getActionButton = (status: string) => {
        switch (status) {
            case "Sudah Digenerate":
                return (
                    <Button variant="outline" size="sm" className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                );
            case "Siap Digenerate":
                return (
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Award className="h-4 w-4" />
                        Generate
                    </Button>
                );
            case "Menunggu Penilaian":
                return (
                    <Button variant="secondary" size="sm" disabled className="gap-2">
                        <Clock className="h-4 w-4" />
                        Tertunda
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Generate Sertifikat</h2>
                <p className="text-muted-foreground">
                    Kelola penerbitan sertifikat PKL untuk siswa yang telah menyelesaikan penilaian.
                </p>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Daftar Siswa & Status Sertifikat</CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau NISN..."
                                className="pl-8 bg-background"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">No</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>NISN</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Tempat Industri</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyStudents.map((student, index) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="text-center font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold">{student.nama}</TableCell>
                                        <TableCell>{student.nisn}</TableCell>
                                        <TableCell>{student.kelas}</TableCell>
                                        <TableCell>{student.industri}</TableCell>
                                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                                        <TableCell className="text-center">
                                            {getActionButton(student.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}