'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createIndustri } from "@/api/admin/industri"
import { getJurusan } from "@/api/admin/jurusan/index."
import { ArrowLeft, Save, Building, AlertCircle, Mail, Phone, User, MapPin, Briefcase } from "lucide-react"
import { toast } from "sonner"

interface IndustriFormData {
    nama: string
    alamat: string
    bidang: string
    email: string
    jurusan_id: number
    no_telp: string
    pic: string
    pic_telp: string
}

interface JurusanOption {
    id: number
    kode: string
    nama: string
}

const initialFormData: IndustriFormData = {
    nama: '',
    alamat: '',
    bidang: '',
    email: '',
    jurusan_id: 0,
    no_telp: '',
    pic: '',
    pic_telp: ''
}

export default function CreateIndustriPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loadingJurusan, setLoadingJurusan] = useState(true)
    const [formData, setFormData] = useState<IndustriFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof IndustriFormData, string>>>({})
    const [jurusanOptions, setJurusanOptions] = useState<JurusanOption[]>([])

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

    // Load jurusan options
    useEffect(() => {
        const loadJurusanOptions = async () => {
            try {
                setLoadingJurusan(true)
                const response = await getJurusan()
                if (response && response.data && response.data.data) {
                    setJurusanOptions(response.data.data)
                } else {
                    toast.error('Gagal memuat data jurusan')
                }
            } catch (error) {
                console.error('Load jurusan error:', error)
                toast.error('Gagal memuat data jurusan')
            } finally {
                setLoadingJurusan(false)
            }
        }

        loadJurusanOptions()
    }, [])

    const handleInputChange = (field: keyof IndustriFormData, value: string | number) => {
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
        const newErrors: Partial<Record<keyof IndustriFormData, string>> = {}

        // Required fields validation
        const requiredFields = ['nama', 'alamat', 'jurusan_id']

        requiredFields.forEach(field => {
            const fieldKey = field as keyof IndustriFormData
            if (!formData[fieldKey] || (field === 'jurusan_id' && formData.jurusan_id === 0)) {
                newErrors[fieldKey] = 'Field ini wajib diisi'
            }
        })

        // Nama validation
        if (formData.nama && formData.nama.length < 2) {
            newErrors.nama = 'Nama industri minimal 2 karakter'
        } else if (formData.nama && formData.nama.length > 100) {
            newErrors.nama = 'Nama industri maksimal 100 karakter'
        }

        // Email validation (optional)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid'
        }

        // Phone validation (optional)
        if (formData.no_telp && !/^[0-9+\-\s()]+$/.test(formData.no_telp)) {
            newErrors.no_telp = 'Format nomor telepon tidak valid'
        }

        // PIC Phone validation (optional)
        if (formData.pic_telp && !/^[0-9+\-\s()]+$/.test(formData.pic_telp)) {
            newErrors.pic_telp = 'Format nomor telepon PIC tidak valid'
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
            const industriData = {
                nama: formData.nama.trim(),
                alamat: formData.alamat.trim(),
                bidang: formData.bidang.trim() || undefined,
                email: formData.email.trim() || undefined,
                jurusan_id: formData.jurusan_id,
                no_telp: formData.no_telp.trim() || undefined,
                pic: formData.pic.trim() || undefined,
                pic_telp: formData.pic_telp.trim() || undefined,
                // Required API fields
                id: 0,
                is_active: true,
                created_at: '',
                updated_at: ''
            }

            const response = await createIndustri(industriData)

            if (response) {
                toast.success('Data industri berhasil dibuat!')
                router.push('/admin/industri')
            } else {
                toast.error('Gagal membuat data industri')
            }
        } catch (error) {
            console.error('Create industri error:', error)
            toast.error('Terjadi kesalahan saat membuat data industri')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setFormData(initialFormData)
        setErrors({})
        toast.info('Form telah direset')
    }

    const handleBack = () => {
        if (Object.values(formData).some(value => 
            (typeof value === 'string' && value.trim() !== '') || 
            (typeof value === 'number' && value !== 0)
        )) {
            if (confirm('Ada data yang belum disimpan. Yakin ingin kembali?')) {
                router.push('/admin/industri')
            }
        } else {
            router.push('/admin/industri')
        }
    }

    const getSelectedJurusan = () => {
        return jurusanOptions.find(j => j.id === formData.jurusan_id)
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
                            <h1 className="text-3xl font-bold text-gray-900">Buat Data Industri</h1>
                            <p className="text-gray-600">Tambahkan mitra industri baru ke sistem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <Label htmlFor="nama">
                                        Nama Industri <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => handleInputChange('nama', e.target.value)}
                                        placeholder="e.g., PT. Teknologi Indonesia"
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

                                <div className="space-y-2">
                                    <Label htmlFor="bidang" className="flex items-center space-x-1">
                                        <Briefcase className="h-4 w-4" />
                                        <span>Bidang Usaha</span>
                                    </Label>
                                    <Input
                                        id="bidang"
                                        type="text"
                                        value={formData.bidang}
                                        onChange={(e) => handleInputChange('bidang', e.target.value)}
                                        placeholder="e.g., Teknologi Informasi"
                                        className={errors.bidang ? 'border-red-500' : ''}
                                    />
                                    {errors.bidang && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.bidang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jurusan_id">
                                        Jurusan Terkait <span className="text-red-500">*</span>
                                    </Label>
                                    {loadingJurusan ? (
                                        <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                            <span className="ml-2 text-sm text-gray-500">Memuat jurusan...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.jurusan_id.toString()}
                                            onValueChange={(value) => handleInputChange('jurusan_id', parseInt(value))}
                                        >
                                            <SelectTrigger className={errors.jurusan_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih jurusan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jurusanOptions.map((jurusan) => (
                                                    <SelectItem key={jurusan.id} value={jurusan.id.toString()}>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-mono text-sm font-semibold">
                                                                {jurusan.kode}
                                                            </span>
                                                            <span>-</span>
                                                            <span>{jurusan.nama}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {errors.jurusan_id && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.jurusan_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-1">
                                        <Mail className="h-4 w-4" />
                                        <span>Email</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="e.g., info@perusahaan.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_telp" className="flex items-center space-x-1">
                                        <Phone className="h-4 w-4" />
                                        <span>No. Telepon</span>
                                    </Label>
                                    <Input
                                        id="no_telp"
                                        type="tel"
                                        value={formData.no_telp}
                                        onChange={(e) => handleInputChange('no_telp', e.target.value)}
                                        placeholder="e.g., 021-12345678"
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
                                <Label htmlFor="alamat" className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Alamat <span className="text-red-500">*</span></span>
                                </Label>
                                <Textarea
                                    id="alamat"
                                    value={formData.alamat}
                                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                                    placeholder="Masukkan alamat lengkap industri"
                                    rows={3}
                                    className={errors.alamat ? 'border-red-500' : ''}
                                />
                                {errors.alamat && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Person Information */}
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
                                    <Label htmlFor="pic">Nama PIC</Label>
                                    <Input
                                        id="pic"
                                        type="text"
                                        value={formData.pic}
                                        onChange={(e) => handleInputChange('pic', e.target.value)}
                                        placeholder="e.g., Budi Santoso"
                                        className={errors.pic ? 'border-red-500' : ''}
                                    />
                                    {errors.pic && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.pic}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pic_telp" className="flex items-center space-x-1">
                                        <Phone className="h-4 w-4" />
                                        <span>No. Telepon PIC</span>
                                    </Label>
                                    <Input
                                        id="pic_telp"
                                        type="tel"
                                        value={formData.pic_telp}
                                        onChange={(e) => handleInputChange('pic_telp', e.target.value)}
                                        placeholder="e.g., 081234567890"
                                        className={errors.pic_telp ? 'border-red-500' : ''}
                                    />
                                    {errors.pic_telp && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.pic_telp}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    {(formData.nama.trim() || formData.bidang.trim() || getSelectedJurusan()) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-500 rounded-full">
                                            <Building className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-purple-900">
                                                {formData.nama.trim() || '[NAMA INDUSTRI]'}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-sm text-purple-700">
                                                {formData.bidang.trim() && (
                                                    <>
                                                        <span>{formData.bidang}</span>
                                                        {getSelectedJurusan() && <span>•</span>}
                                                    </>
                                                )}
                                                {getSelectedJurusan() && (
                                                    <span className="font-mono bg-purple-100 px-2 py-1 rounded text-xs">
                                                        {getSelectedJurusan()?.kode}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                            disabled={loading || loadingJurusan}
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
                                    <span>Simpan Data Industri</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
