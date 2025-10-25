'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSiswaById, updateSiswa } from "@/api/admin/siswa"
import { getKelas } from "@/api/admin/kelas"
import { Kelas } from "@/types/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ArrowLeft, Save, User, AlertCircle, Calendar, Phone, MapPin, GraduationCap, Check } from "lucide-react"
import { toast } from "sonner"

interface SiswaFormData {
    nama_lengkap: string
    nisn: string
    kelas_id: number
    alamat: string
    no_telp: string
    tanggal_lahir: string
}

const initialFormData: SiswaFormData = {
    nama_lengkap: '',
    nisn: '',
    kelas_id: 0,
    alamat: '',
    no_telp: '',
    tanggal_lahir: ''
}

export default function EditSiswaPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [formData, setFormData] = useState<SiswaFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof SiswaFormData, string>>>({})
    const [kelasList, setKelasList] = useState<Kelas[]>([])
    const [kelasLoading, setKelasLoading] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const loadKelas = async () => {
            setKelasLoading(true)
            try {
                const response = await getKelas()
                if (response && response.data) {
                    setKelasList(response.data.data || [])
                }
            } catch (error) {
                console.error('Failed to load kelas:', error)
                toast.error('Gagal memuat data kelas')
            } finally {
                setKelasLoading(false)
            }
        }

        loadKelas()
    }, [])

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
                setLoadingData(true)
                const response = await getSiswaById(parseInt(id))

                if (response && response.data) {
                    const siswaData = response.data
                    setFormData({
                        nama_lengkap: siswaData.nama_lengkap || '',
                        nisn: siswaData.nisn || '',
                        kelas_id: siswaData.kelas_id || 0,
                        alamat: siswaData.alamat || '',
                        no_telp: siswaData.no_telp || '',
                        tanggal_lahir: siswaData.tanggal_lahir ? siswaData.tanggal_lahir.split('T')[0] : ''
                    })
                } else {
                    toast.error('Data siswa tidak ditemukan')
                    router.push('/admin/siswa')
                }
            } catch (error) {
                console.error('Load siswa error:', error)
                toast.error('Gagal memuat data siswa')
                router.push('/admin/siswa')
            } finally {
                setLoadingData(false)
            }
        }

        if (id) {
            loadSiswaData()
        }
    }, [id, router])

    const handleInputChange = (field: keyof SiswaFormData, value: string | number) => {
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
        const newErrors: Partial<Record<keyof SiswaFormData, string>> = {}

        // Required fields validation
        const requiredFields = ['nama_lengkap', 'nisn', 'kelas_id', 'alamat', 'tanggal_lahir']

        requiredFields.forEach(field => {
            const fieldKey = field as keyof SiswaFormData
            if (!formData[fieldKey] || (field === 'kelas_id' && formData.kelas_id === 0)) {
                newErrors[fieldKey] = 'Field ini wajib diisi'
            }
        })

        // NISN validation (10 digits)
        if (formData.nisn && !/^\d{10}$/.test(formData.nisn)) {
            newErrors.nisn = 'NISN harus terdiri dari 10 digit angka'
        }

        // Phone validation (optional)
        if (formData.no_telp && !/^[0-9+\-\s()]+$/.test(formData.no_telp)) {
            newErrors.no_telp = 'Format nomor telepon tidak valid'
        }

        // Date validation
        if (formData.tanggal_lahir) {
            const birthDate = new Date(formData.tanggal_lahir)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()

            if (birthDate > today) {
                newErrors.tanggal_lahir = 'Tanggal lahir tidak boleh di masa depan'
            } else if (age > 25) {
                newErrors.tanggal_lahir = 'Tanggal lahir tidak valid (terlalu tua)'
            } else if (age < 5) {
                newErrors.tanggal_lahir = 'Tanggal lahir tidak valid (terlalu muda)'
            }
        }

        // Kelas ID validation
        if (!formData.kelas_id || formData.kelas_id === 0) {
            newErrors.kelas_id = 'Kelas wajib dipilih'
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

            const siswaData = {
                ...formData,
                // Required API fields
                id: parseInt(id),
                created_at: '',
                updated_at: ''
            }

            const response = await updateSiswa(parseInt(id), siswaData)

            if (response) {
                toast.success('Data siswa berhasil diperbarui!')
                router.push('/admin/siswa')
            } else {
                toast.error('Gagal memperbarui data siswa')
            }
        } catch (error) {
            console.error('Update siswa error:', error)
            toast.error('Terjadi kesalahan saat memperbarui data siswa')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        router.push('/admin/siswa')
    }

    if (loadingData) {
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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Data Siswa</h1>
                            <p className="text-gray-600">Perbarui informasi siswa dalam sistem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Informasi Pribadi</span>
                            </CardTitle>
                            <CardDescription>
                                Data pribadi siswa untuk sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_lengkap"
                                        type="text"
                                        value={formData.nama_lengkap}
                                        onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                                        placeholder="Masukkan nama lengkap siswa"
                                        className={errors.nama_lengkap ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_lengkap && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nama_lengkap}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nisn">
                                        NISN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nisn"
                                        type="text"
                                        value={formData.nisn}
                                        onChange={(e) => handleInputChange('nisn', e.target.value.replace(/\D/g, ''))}
                                        placeholder="10 digit angka"
                                        maxLength={10}
                                        className={errors.nisn ? 'border-red-500' : ''}
                                    />
                                    {errors.nisn && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nisn}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id" className="flex items-center space-x-1">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Kelas <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={`w-full justify-between ${errors.kelas_id ? 'border-red-500' : ''} ${!formData.kelas_id || formData.kelas_id === 0 ? 'text-muted-foreground' : ''}`}
                                                disabled={kelasLoading}
                                            >
                                                {formData.kelas_id && formData.kelas_id !== 0
                                                    ? kelasList.find((kelas) => kelas.id === formData.kelas_id)?.nama
                                                    : kelasLoading
                                                        ? "Memuat kelas..."
                                                        : "Pilih kelas..."}
                                                <GraduationCap className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari kelas..." />
                                                <CommandList>
                                                    <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {kelasList.map((kelas) => (
                                                            <CommandItem
                                                                key={kelas.id}
                                                                value={kelas.nama}
                                                                onSelect={() => {
                                                                    handleInputChange('kelas_id', kelas.id)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <Check className={`mr-2 h-4 w-4 ${formData.kelas_id === kelas.id ? 'opacity-100' : 'opacity-0'}`} />
                                                                <GraduationCap className="mr-2 h-4 w-4" />
                                                                {kelas.nama}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.kelas_id && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.kelas_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir" className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Tanggal Lahir <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={formData.tanggal_lahir}
                                        onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                                        className={errors.tanggal_lahir ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.tanggal_lahir}
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
                                <Label htmlFor="alamat" className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Alamat <span className="text-red-500">*</span></span>
                                </Label>
                                <Textarea
                                    id="alamat"
                                    value={formData.alamat}
                                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                                    placeholder="Masukkan alamat lengkap siswa"
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
                                    <span>Perbarui Data Siswa</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
