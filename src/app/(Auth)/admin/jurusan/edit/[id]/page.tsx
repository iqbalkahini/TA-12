'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getJurusanById, updateJurusan } from "@/api/admin/jurusan/index."
import { ArrowLeft, Save, GraduationCap, AlertCircle, BookOpen } from "lucide-react"
import { toast } from "sonner"

interface JurusanFormData {
    kode: string
    nama: string
}

const initialFormData: JurusanFormData = {
    kode: '',
    nama: ''
}

export default function EditJurusanPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [formData, setFormData] = useState<JurusanFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof JurusanFormData, string>>>({})

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
                setLoadingData(true)
                const response = await getJurusanById(parseInt(id))
                
                if (response && response.data) {
                    const jurusanData = response.data
                    setFormData({
                        kode: jurusanData.kode || '',
                        nama: jurusanData.nama || ''
                    })
                } else {
                    toast.error('Data jurusan tidak ditemukan')
                    router.push('/admin/jurusan')
                }
            } catch (error) {
                console.error('Load jurusan error:', error)
                toast.error('Gagal memuat data jurusan')
                router.push('/admin/jurusan')
            } finally {
                setLoadingData(false)
            }
        }

        if (id) {
            loadJurusanData()
        }
    }, [id, router])

    const handleInputChange = (field: keyof JurusanFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Partial<Record<keyof JurusanFormData, string>> = {}

        // Required fields validation
        if (!formData.kode.trim()) {
            newErrors.kode = 'Kode jurusan wajib diisi'
        } else if (formData.kode.trim().length < 2) {
            newErrors.kode = 'Kode jurusan minimal 2 karakter'
        } else if (formData.kode.trim().length > 10) {
            newErrors.kode = 'Kode jurusan maksimal 10 karakter'
        } else if (!/^[A-Z0-9\-_]+$/.test(formData.kode.trim())) {
            newErrors.kode = 'Kode jurusan hanya boleh menggunakan huruf kapital, angka, dash (-), dan underscore (_)'
        }

        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama jurusan wajib diisi'
        } else if (formData.nama.trim().length < 3) {
            newErrors.nama = 'Nama jurusan minimal 3 karakter'
        } else if (formData.nama.trim().length > 100) {
            newErrors.nama = 'Nama jurusan maksimal 100 karakter'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Mohon periksa kembali data yang diisi')
            return
        }

        try {
            setLoading(true)

            const jurusanData = {
                kode: formData.kode.trim().toUpperCase(),
                nama: formData.nama.trim(),
                // Required API fields
                id: parseInt(id),
                created_at: '',
                updated_at: ''
            }

            const response = await updateJurusan(parseInt(id), jurusanData)

            if (response) {
                toast.success('Data jurusan berhasil diperbarui!')
                router.push('/admin/jurusan')
            } else {
                toast.error('Gagal memperbarui data jurusan')
            }
        } catch (error) {
            console.error('Update jurusan error:', error)
            toast.error('Terjadi kesalahan saat memperbarui data jurusan')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        router.push('/admin/jurusan')
    }

    if (loadingData) {
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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Data Jurusan</h1>
                            <p className="text-gray-600">Perbarui informasi program studi dalam sistem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <GraduationCap className="h-5 w-5" />
                                <span>Informasi Jurusan</span>
                            </CardTitle>
                            <CardDescription>
                                Data dasar program studi untuk sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kode">
                                        Kode Jurusan <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="kode"
                                        type="text"
                                        value={formData.kode}
                                        onChange={(e) => handleInputChange('kode', e.target.value.toUpperCase())}
                                        placeholder="e.g., RPL, TKJ, MM"
                                        className={errors.kode ? 'border-red-500' : ''}
                                        maxLength={10}
                                    />
                                    {errors.kode && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.kode}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Gunakan huruf kapital, angka, dash (-), atau underscore (_)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama" className="flex items-center space-x-1">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Nama Jurusan <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => handleInputChange('nama', e.target.value)}
                                        placeholder="e.g., Rekayasa Perangkat Lunak"
                                        className={errors.nama ? 'border-red-500' : ''}
                                        maxLength={100}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Preview */}
                            {(formData.kode.trim() || formData.nama.trim()) && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
                                    <div className="text-sm text-blue-800">
                                        <span className="font-semibold">{formData.kode.trim().toUpperCase() || '[KODE]'}</span>
                                        {' - '}
                                        <span>{formData.nama.trim() || '[NAMA JURUSAN]'}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 min-w-[150px]"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Perbarui Data Jurusan</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
