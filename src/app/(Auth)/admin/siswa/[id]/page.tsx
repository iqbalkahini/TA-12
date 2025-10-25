'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSiswaById } from "@/api/admin/siswa"
import { getKelasById } from "@/api/admin/kelas/index"
import { ArrowLeft, User, Edit, Phone, MapPin, GraduationCap, Calendar } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatDateTime, calculateAge } from "@/utils/date"

interface SiswaData {
    id: number
    nama_lengkap: string
    nisn: string
    kelas_id: number
    alamat?: string
    no_telp?: string
    tanggal_lahir?: string
    created_at: string
    updated_at: string
}

interface KelasData {
    id: number
    nama: string
    jurusan_id: number
}

export default function ViewSiswaPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [siswaData, setSiswaData] = useState<SiswaData | null>(null)
    const [kelasData, setKelasData] = useState<KelasData | null>(null)

    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            router.push('/login')
        } catch (err) {
            console.error('Logout failed:', err)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            router.push('/login')
        }
    }

    // Load siswa data
    useEffect(() => {
        const loadSiswaData = async () => {
            try {
                setLoading(true)
                const response = await getSiswaById(parseInt(id))

                if (response && response.data) {
                    const siswa = response.data
                    setSiswaData(siswa)

                    // Load kelas data if kelas_id exists
                    if (siswa.kelas_id) {
                        const kelasResponse = await getKelasById(siswa.kelas_id)
                        if (kelasResponse && kelasResponse.data) {
                            setKelasData(kelasResponse.data)
                        }
                    }
                } else {
                    toast.error('Data siswa tidak ditemukan')
                    router.push('/admin/siswa')
                }
            } catch (error) {
                console.error('Load siswa error:', error)
                toast.error('Gagal memuat data siswa')
                router.push('/admin/siswa')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadSiswaData()
        }
    }, [id, router])

    const handleBack = () => {
        router.push('/admin/siswa')
    }

    const handleEdit = () => {
        router.push(`/admin/siswa/edit/${id}`)
    }



    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memuat data siswa...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!siswaData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-4">Data siswa yang Anda cari tidak ditemukan</p>
                        <Button onClick={handleBack}>
                            Kembali ke Daftar Siswa
                        </Button>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Kembali</span>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Data Siswa</h1>
                            <p className="text-gray-600">Informasi lengkap siswa {siswaData.nama_lengkap}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Informasi Pribadi</span>
                        </CardTitle>
                        <CardDescription>
                            Data pribadi siswa dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                                <Input
                                    value={siswaData.nama_lengkap}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">NISN</Label>
                                <Input
                                    value={siswaData.nisn}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>Kelas</span>
                                </Label>
                                <Input
                                    value={kelasData ? kelasData.nama : `Kelas ID: ${siswaData.kelas_id}`}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                    <Phone className="h-4 w-4" />
                                    <span>No. Telepon</span>
                                </Label>
                                <Input
                                    value={siswaData.no_telp || '-'}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Tanggal Lahir</span>
                                </Label>
                                <Input
                                    value={formatDate(siswaData.tanggal_lahir)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Usia</Label>
                                <Input
                                    value={`${calculateAge(siswaData.tanggal_lahir) || '-'} tahun`}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>Alamat</span>
                            </Label>
                            <Textarea
                                value={siswaData.alamat || '-'}
                                readOnly
                                rows={3}
                                className="bg-gray-50 cursor-default resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sistem</CardTitle>
                        <CardDescription>
                            Data sistem dan riwayat perubahan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                <Input
                                    value="Aktif"
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                                <Input
                                    value={formatDateTime(siswaData.created_at)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</Label>
                                <Input
                                    value={formatDateTime(siswaData.updated_at)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Daftar</span>
                    </Button>

                    <Button
                        onClick={handleEdit}
                        className="flex items-center space-x-2"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Data Siswa</span>
                    </Button>
                </div>
            </div>
        </AdminLayout>
    )
}
