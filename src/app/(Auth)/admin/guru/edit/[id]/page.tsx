'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getGuruById, updateGuru } from "@/api/admin/guru"
import { ArrowLeft, Save, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface GuruFormData {
    kode_guru: string
    nama: string
    nip: string
    no_telp: string
    password: string
    is_kaprog: boolean
    is_koordinator: boolean
    is_pembimbing: boolean
    is_wali_kelas: boolean
}

const initialFormData: GuruFormData = {
    kode_guru: '',
    nama: '',
    nip: '',
    no_telp: '',
    password: '',
    is_kaprog: false,
    is_koordinator: false,
    is_pembimbing: false,
    is_wali_kelas: false
}

export default function EditGuruPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<GuruFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof GuruFormData, string>>>({})

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

    // Load existing guru data
    useEffect(() => {
        const loadGuruData = async () => {
            try {
                setLoadingData(true)
                const response = await getGuruById(parseInt(id))
                
                if (response && response.data) {
                    const guru = response.data
                    setFormData({
                        kode_guru: guru.kode_guru || '',
                        nama: guru.nama || '',
                        nip: guru.nip || '',
                        no_telp: guru.no_telp || '',
                        password: '', // Don't load existing password for security
                        is_kaprog: guru.is_kaprog || false,
                        is_koordinator: guru.is_koordinator || false,
                        is_pembimbing: guru.is_pembimbing || false,
                        is_wali_kelas: guru.is_wali_kelas || false
                    })
                } else {
                    toast.error('Data guru tidak ditemukan')
                    router.push('/admin/guru')
                }
            } catch (error) {
                console.error('Load guru error:', error)
                toast.error('Gagal memuat data guru')
                router.push('/admin/guru')
            } finally {
                setLoadingData(false)
            }
        }

        if (id) {
            loadGuruData()
        }
    }, [id, router])

    const handleInputChange = (field: keyof GuruFormData, value: string | boolean) => {
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
        const newErrors: Partial<Record<keyof GuruFormData, string>> = {}

        // Required fields validation (password optional for edit)
        const requiredFields = ['kode_guru', 'nama', 'nip']

        requiredFields.forEach(field => {
            if (!formData[field as keyof GuruFormData]) {
                newErrors[field as keyof GuruFormData] = 'Field ini wajib diisi'
            }
        })

        // Phone validation (optional)
        if (formData.no_telp && !/^[0-9+\-\s()]+$/.test(formData.no_telp)) {
            newErrors.no_telp = 'Format nomor telepon tidak valid'
        }

        // Password validation (only if provided)
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter'
        }

        // NIP validation (18 digits)
        if (formData.nip && !/^\d{18}$/.test(formData.nip)) {
            newErrors.nip = 'NIP harus terdiri dari 18 digit angka'
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

            // Transform formData to match API expected format
            const baseGuruData = {
                kode_guru: formData.kode_guru,
                nama: formData.nama,
                nip: formData.nip,
                no_telp: formData.no_telp,
                is_kaprog: formData.is_kaprog,
                is_koordinator: formData.is_koordinator,
                is_pembimbing: formData.is_pembimbing,
                is_wali_kelas: formData.is_wali_kelas,
                // Required API fields
                id: parseInt(id),
                user_id: 0,
                is_active: true,
                created_at: '',
                updated_at: ''
            }

            // Add password only if provided
            const finalGuruData = formData.password 
                ? { ...baseGuruData, password: formData.password }
                : baseGuruData

            const response = await updateGuru(parseInt(id), finalGuruData)

            if (response) {
                toast.success('Data guru berhasil diperbarui!')
                router.push('/admin/guru')
            } else {
                toast.error('Gagal memperbarui data guru')
            }
        } catch (error) {
            console.error('Update guru error:', error)
            toast.error('Terjadi kesalahan saat memperbarui data guru')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        // Reset to initial loaded data, not empty form
        if (id) {
            window.location.reload()
        }
    }

    const handleBack = () => {
        router.push('/admin/guru')
    }

    if (loadingData) {
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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Data Guru</h1>
                            <p className="text-gray-600">Perbarui data guru dalam sistem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Informasi Guru</span>
                            </CardTitle>
                            <CardDescription>
                                Data dasar guru untuk sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_guru">
                                        Kode Guru <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="kode_guru"
                                        type="text"
                                        value={formData.kode_guru}
                                        onChange={(e) => handleInputChange('kode_guru', e.target.value.toUpperCase())}
                                        placeholder="e.g., GR001"
                                        className={errors.kode_guru ? 'border-red-500' : ''}
                                    />
                                    {errors.kode_guru && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.kode_guru}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => handleInputChange('nama', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        className={errors.nama ? 'border-red-500' : ''}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nip">
                                        NIP <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nip"
                                        type="text"
                                        value={formData.nip}
                                        onChange={(e) => handleInputChange('nip', e.target.value.replace(/\D/g, ''))}
                                        placeholder="18 digit angka"
                                        maxLength={18}
                                        className={errors.nip ? 'border-red-500' : ''}
                                    />
                                    {errors.nip && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nip}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_telp">No. Telepon</Label>
                                    <Input
                                        id="no_telp"
                                        type="tel"
                                        value={formData.no_telp}
                                        onChange={(e) => handleInputChange('no_telp', e.target.value)}
                                        placeholder="e.g., 081234567890"
                                        className={errors.no_telp ? 'border-red-500' : ''}
                                    />
                                    {errors.no_telp && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.no_telp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah password"
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Kosongkan jika tidak ingin mengubah password. Minimal 6 karakter jika diisi.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles & Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Peran & Tanggung Jawab</CardTitle>
                            <CardDescription>
                                Pilih peran yang akan diberikan kepada guru ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                        id="is_kaprog"
                                        checked={formData.is_kaprog}
                                        onCheckedChange={(checked: boolean) =>
                                            handleInputChange('is_kaprog', checked)
                                        }
                                    />
                                    <div>
                                        <Label htmlFor="is_kaprog" className="font-medium">
                                            Kepala Program (Kaprog)
                                        </Label>
                                        <p className="text-sm text-gray-500">Mengelola program keahlian</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                        id="is_koordinator"
                                        checked={formData.is_koordinator}
                                        onCheckedChange={(checked: boolean) =>
                                            handleInputChange('is_koordinator', checked)
                                        }
                                    />
                                    <div>
                                        <Label htmlFor="is_koordinator" className="font-medium">
                                            Koordinator
                                        </Label>
                                        <p className="text-sm text-gray-500">Koordinasi kegiatan sekolah</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                        id="is_pembimbing"
                                        checked={formData.is_pembimbing}
                                        onCheckedChange={(checked: boolean) =>
                                            handleInputChange('is_pembimbing', checked)
                                        }
                                    />
                                    <div>
                                        <Label htmlFor="is_pembimbing" className="font-medium">
                                            Pembimbing
                                        </Label>
                                        <p className="text-sm text-gray-500">Membimbing siswa magang</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                        id="is_wali_kelas"
                                        checked={formData.is_wali_kelas}
                                        onCheckedChange={(checked: boolean) =>
                                            handleInputChange('is_wali_kelas', checked)
                                        }
                                    />
                                    <div>
                                        <Label htmlFor="is_wali_kelas" className="font-medium">
                                            Wali Kelas
                                        </Label>
                                        <p className="text-sm text-gray-500">Mengelola kelas tertentu</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end">
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={loading}
                                className="mr-2"
                            >
                                Reset Form
                            </Button>
                        </div>

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
                                    <span>Perbarui Data Guru</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
