'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getGuruById } from "@/api/admin/guru"
import { ArrowLeft, User, Edit, Phone, Shield } from "lucide-react"
import { toast } from "sonner"

interface GuruData {
    id: number
    kode_guru: string
    nama: string
    nip: string
    no_telp: string
    is_kaprog: boolean
    is_koordinator: boolean
    is_pembimbing: boolean
    is_wali_kelas: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

export default function ViewGuruPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    
    const [loading, setLoading] = useState(true)
    const [guruData, setGuruData] = useState<GuruData | null>(null)

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

    // Load guru data
    useEffect(() => {
        const loadGuruData = async () => {
            try {
                setLoading(true)
                const response = await getGuruById(parseInt(id))
                
                if (response && response.data) {
                    setGuruData(response.data)
                } else {
                    toast.error('Data guru tidak ditemukan')
                    router.push('/admin/guru')
                }
            } catch (error) {
                console.error('Load guru error:', error)
                toast.error('Gagal memuat data guru')
                router.push('/admin/guru')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadGuruData()
        }
    }, [id, router])

    const handleBack = () => {
        router.push('/admin/guru')
    }

    const handleEdit = () => {
        router.push(`/admin/guru/edit/${id}`)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    if (loading) {
        return (
            <AdminLayout onLogout={handleLogout}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memuat data guru...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!guruData) {
        return (
            <AdminLayout onLogout={handleLogout}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-4">Data guru yang Anda cari tidak ditemukan</p>
                        <Button onClick={handleBack}>
                            Kembali ke Daftar Guru
                        </Button>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout onLogout={handleLogout}>
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
                            <h1 className="text-3xl font-bold text-gray-900">Detail Data Guru</h1>
                            <p className="text-gray-600">Informasi lengkap guru {guruData.nama}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Informasi Guru</span>
                        </CardTitle>
                        <CardDescription>
                            Data dasar guru dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Kode Guru</Label>
                                <Input
                                    value={guruData.kode_guru}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                                <Input
                                    value={guruData.nama}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">NIP</Label>
                                <Input
                                    value={guruData.nip}
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
                                    value={guruData.no_telp || '-'}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Roles & Responsibilities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Peran & Tanggung Jawab</span>
                        </CardTitle>
                        <CardDescription>
                            Peran yang diberikan kepada guru ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                                guruData.is_kaprog ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    guruData.is_kaprog 
                                        ? 'border-red-500 bg-red-500' 
                                        : 'border-gray-300 bg-white'
                                }`}>
                                    {guruData.is_kaprog && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                    <Label className="font-medium">
                                        Kepala Program (Kaprog)
                                    </Label>
                                    <p className="text-sm text-gray-500">Mengelola program keahlian</p>
                                </div>
                            </div>

                            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                                guruData.is_koordinator ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    guruData.is_koordinator 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : 'border-gray-300 bg-white'
                                }`}>
                                    {guruData.is_koordinator && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                    <Label className="font-medium">
                                        Koordinator
                                    </Label>
                                    <p className="text-sm text-gray-500">Koordinasi kegiatan sekolah</p>
                                </div>
                            </div>

                            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                                guruData.is_pembimbing ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    guruData.is_pembimbing 
                                        ? 'border-green-500 bg-green-500' 
                                        : 'border-gray-300 bg-white'
                                }`}>
                                    {guruData.is_pembimbing && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                    <Label className="font-medium">
                                        Pembimbing
                                    </Label>
                                    <p className="text-sm text-gray-500">Membimbing siswa magang</p>
                                </div>
                            </div>

                            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                                guruData.is_wali_kelas ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    guruData.is_wali_kelas 
                                        ? 'border-yellow-500 bg-yellow-500' 
                                        : 'border-gray-300 bg-white'
                                }`}>
                                    {guruData.is_wali_kelas && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                    <Label className="font-medium">
                                        Wali Kelas
                                    </Label>
                                    <p className="text-sm text-gray-500">Mengelola kelas tertentu</p>
                                </div>
                            </div>
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
                                <Label className="text-sm font-medium text-gray-700">ID Guru</Label>
                                <Input
                                    value={guruData.id.toString()}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                <Input
                                    value={guruData.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                                <Input
                                    value={formatDate(guruData.created_at)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</Label>
                                <Input
                                    value={formatDate(guruData.updated_at)}
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
                        <span>Edit Data Guru</span>
                    </Button>
                </div>
            </div>
        </AdminLayout>
    )
}
