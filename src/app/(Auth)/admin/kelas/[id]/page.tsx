'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getKelasById } from "@/api/admin/kelas"
import { getJurusanById } from "@/api/admin/jurusan"
import { ArrowLeft, School, Edit, Users, Calendar, GraduationCap } from "lucide-react"
import { toast } from "sonner"

interface KelasData {
    id: number
    nama: string
    jurusan_id: number
    created_at: string
    updated_at: string
}

interface JurusanData {
    id: number
    kode: string
    nama: string
}

export default function ViewKelasPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [kelasData, setKelasData] = useState<KelasData | null>(null)
    const [jurusanData, setJurusanData] = useState<JurusanData | null>(null)

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

    // Load kelas data
    useEffect(() => {
        const loadKelasData = async () => {
            try {
                setLoading(true)
                const response = await getKelasById(parseInt(id))

                if (response && response.data) {
                    const kelas = response.data
                    setKelasData(kelas)

                    // Load jurusan data
                    if (kelas.jurusan_id) {
                        const jurusanResponse = await getJurusanById(kelas.jurusan_id)
                        if (jurusanResponse && jurusanResponse.data) {
                            setJurusanData(jurusanResponse.data)
                        }
                    }
                } else {
                    toast.error('Data kelas tidak ditemukan')
                    router.push('/admin/kelas')
                }
            } catch (error) {
                console.error('Load kelas error:', error)
                toast.error('Gagal memuat data kelas')
                router.push('/admin/kelas')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadKelasData()
        }
    }, [id, router])

    const handleBack = () => {
        router.push('/admin/kelas')
    }

    const handleEdit = () => {
        router.push(`/admin/kelas/edit/${id}`)
    }

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '-'
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memuat data kelas...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!kelasData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-4">Data kelas yang Anda cari tidak ditemukan</p>
                        <Button onClick={handleBack}>
                            Kembali ke Daftar Kelas
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
                            <h1 className="text-3xl font-bold text-gray-900">Detail Data Kelas</h1>
                            <p className="text-gray-600">Informasi lengkap kelas {kelasData.nama}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Informasi Kelas</span>
                        </CardTitle>
                        <CardDescription>
                            Data kelas dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama Kelas</Label>
                                <Input
                                    value={kelasData.nama}
                                    readOnly
                                    className="bg-gray-50 cursor-default font-semibold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Kode Jurusan</Label>
                                <Input
                                    value={jurusanData?.kode}
                                    readOnly
                                    className="bg-gray-50 cursor-default font-mono text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama Jurusan</Label>
                                <Input
                                    value={jurusanData?.nama}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                                <Input
                                    value={formatDateTime(kelasData.created_at)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</Label>
                                <Input
                                    value={formatDateTime(kelasData.updated_at)}
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
                        <span>Edit Data Kelas</span>
                    </Button>
                </div>
            </div>
        </AdminLayout>
    )
}
