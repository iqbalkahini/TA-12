'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getJurusanById } from "@/api/admin/jurusan/index."
import { ArrowLeft, GraduationCap, Edit, BookOpen, Calendar } from "lucide-react"
import { toast } from "sonner"

interface JurusanData {
    id: number
    kode: string
    nama: string
    created_at: string
    updated_at: string
}

export default function ViewJurusanPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    
    const [loading, setLoading] = useState(true)
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

    // Load jurusan data
    useEffect(() => {
        const loadJurusanData = async () => {
            try {
                setLoading(true)
                const response = await getJurusanById(parseInt(id))
                
                if (response && response.data) {
                    setJurusanData(response.data)
                } else {
                    toast.error('Data jurusan tidak ditemukan')
                    router.push('/admin/jurusan')
                }
            } catch (error) {
                console.error('Load jurusan error:', error)
                toast.error('Gagal memuat data jurusan')
                router.push('/admin/jurusan')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadJurusanData()
        }
    }, [id, router])

    const handleBack = () => {
        router.push('/admin/jurusan')
    }

    const handleEdit = () => {
        router.push(`/admin/jurusan/edit/${id}`)
    }

    const formatDateTime = (dateString: string) => {
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
                        <p className="mt-2 text-gray-600">Memuat data jurusan...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!jurusanData) {
        return (
            <AdminLayout onLogout={handleLogout}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-4">Data jurusan yang Anda cari tidak ditemukan</p>
                        <Button onClick={handleBack}>
                            Kembali ke Daftar Jurusan
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
                            <h1 className="text-3xl font-bold text-gray-900">Detail Data Jurusan</h1>
                            <p className="text-gray-600">Informasi lengkap program studi {jurusanData.nama}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5" />
                            <span>Informasi Jurusan</span>
                        </CardTitle>
                        <CardDescription>
                            Data program studi dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Kode Jurusan</Label>
                                <Input
                                    value={jurusanData.kode}
                                    readOnly
                                    className="bg-gray-50 cursor-default font-mono text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama Jurusan</Label>
                                <Input
                                    value={jurusanData.nama}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                                <Input
                                    value={formatDateTime(jurusanData.created_at)}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</Label>
                                <Input
                                    value={formatDateTime(jurusanData.updated_at)}
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
                        <span>Edit Data Jurusan</span>
                    </Button>
                </div>
            </div>
        </AdminLayout>
    )
}
