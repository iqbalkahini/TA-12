'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getIndustriById } from "@/api/admin/industri"
import { getJurusanById } from "@/api/admin/jurusan"
import { ArrowLeft, Building, Edit, Mail, Phone, User, MapPin, Briefcase, Calendar, GraduationCap } from "lucide-react"
import { toast } from "sonner"

interface IndustriData {
    id: number
    nama: string
    alamat: string
    bidang?: string
    email?: string
    jurusan_id: number
    no_telp?: string
    pic?: string
    pic_telp?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

interface JurusanData {
    id: number
    kode: string
    nama: string
}

export default function ViewIndustriPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [industriData, setIndustriData] = useState<IndustriData | null>(null)
    const [jurusanData, setJurusanData] = useState<JurusanData | null>(null)



    // Load industri data
    useEffect(() => {
        const loadIndustriData = async () => {
            try {
                setLoading(true)
                const response = await getIndustriById(parseInt(id))

                if (response && response.data) {
                    const industri = response.data
                    setIndustriData(industri)

                    // Load jurusan data
                    if (industri.jurusan_id) {
                        const jurusanResponse = await getJurusanById(industri.jurusan_id)
                        if (jurusanResponse && jurusanResponse.data) {
                            setJurusanData(jurusanResponse.data)
                        }
                    }
                } else {
                    toast.error('Data industri tidak ditemukan')
                    router.push('/admin/industri')
                }
            } catch (error) {
                console.error('Load industri error:', error)
                toast.error('Gagal memuat data industri')
                router.push('/admin/industri')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadIndustriData()
        }
    }, [id, router])

    const handleBack = () => {
        router.push('/admin/industri')
    }

    const handleEdit = () => {
        router.push(`/admin/industri/edit/${id}`)
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
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memuat data industri...</p>
                </div>
            </div>
        )
    }

    if (!industriData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-4">Data industri yang Anda cari tidak ditemukan</p>
                    <Button onClick={handleBack}>
                        Kembali ke Daftar Industri
                    </Button>
                </div>
            </div>
        )
    }

    return (
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
                        <h1 className="text-3xl font-bold text-gray-900">Detail Data Industri</h1>
                        <p className="text-gray-600">Informasi lengkap mitra industri {industriData.nama}</p>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2">
                <Badge variant={industriData.is_active ? "default" : "secondary"} className="text-sm">
                    {industriData.is_active ? "✓ Aktif" : "✗ Tidak Aktif"}
                </Badge>
                {industriData.bidang && (
                    <Badge variant="outline" className="text-sm">
                        {industriData.bidang}
                    </Badge>
                )}
                {jurusanData && (
                    <Badge variant="secondary" className="text-sm font-mono">
                        {jurusanData.kode}
                    </Badge>
                )}
            </div>

            {/* Company Preview */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-500 rounded-full">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-purple-900">{industriData.nama}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                                {industriData.bidang && (
                                    <span className="text-purple-700">{industriData.bidang}</span>
                                )}
                                {industriData.bidang && jurusanData && <span className="text-purple-600">•</span>}
                                {jurusanData && (
                                    <span className="text-purple-700">{jurusanData.nama}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-purple-600">ID Industri</div>
                        <div className="text-lg font-bold text-purple-900">#{industriData.id}</div>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Informasi Industri</span>
                    </CardTitle>
                    <CardDescription>
                        Data dasar industri/perusahaan mitra
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Nama Industri</Label>
                            <Input
                                value={industriData.nama}
                                readOnly
                                className="bg-gray-50 cursor-default font-semibold text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <Briefcase className="h-4 w-4" />
                                <span>Bidang Usaha</span>
                            </Label>
                            <Input
                                value={industriData.bidang || '-'}
                                readOnly
                                className="bg-gray-50 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>Email</span>
                            </Label>
                            <Input
                                value={industriData.email || '-'}
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
                                value={industriData.no_telp || '-'}
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
                            value={industriData.alamat}
                            readOnly
                            rows={3}
                            className="bg-gray-50 cursor-default resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Jurusan Information */}
            {jurusanData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <GraduationCap className="h-5 w-5" />
                            <span>Informasi Jurusan Terkait</span>
                        </CardTitle>
                        <CardDescription>
                            Program studi yang terkait dengan industri ini
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
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contact Person Information */}
            {(industriData.pic || industriData.pic_telp) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Informasi Person in Charge (PIC)</span>
                        </CardTitle>
                        <CardDescription>
                            Data kontak person yang bertanggung jawab
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Nama PIC</Label>
                                <Input
                                    value={industriData.pic || '-'}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                    <Phone className="h-4 w-4" />
                                    <span>No. Telepon PIC</span>
                                </Label>
                                <Input
                                    value={industriData.pic_telp || '-'}
                                    readOnly
                                    className="bg-gray-50 cursor-default"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Informasi Sistem</span>
                    </CardTitle>
                    <CardDescription>
                        Data sistem dan riwayat perubahan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">ID Industri</Label>
                            <Input
                                value={industriData.id.toString()}
                                readOnly
                                className="bg-gray-50 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Status</Label>
                            <Input
                                value={industriData.is_active ? 'Aktif' : 'Tidak Aktif'}
                                readOnly
                                className="bg-gray-50 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                            <Input
                                value={formatDateTime(industriData.created_at)}
                                readOnly
                                className="bg-gray-50 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</Label>
                            <Input
                                value={formatDateTime(industriData.updated_at)}
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
                    <span>Edit Data Industri</span>
                </Button>
            </div>
        </div>
    )
}
