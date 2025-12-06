'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createJurusan } from "@/api/admin/jurusan"
import { ArrowLeft, Save, GraduationCap, AlertCircle, BookOpen, User, ChevronsUpDown, Check } from "lucide-react"
import { toast } from "sonner"
import { Guru } from "@/types/api"
import { getGuru } from "@/api/admin/guru"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface JurusanFormData {
    kode: string
    nama: string
    kaprog_guru_id: number
}

const initialFormData: JurusanFormData = {
    kode: '',
    nama: '',
    kaprog_guru_id: 0
}

export default function CreateJurusanPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<JurusanFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof JurusanFormData, string>>>({})
    const [dataKapro, setDataKapro] = useState<Guru[]>([])
    const [loadingKapro, setLoadingKapro] = useState(true)
    const [openKapro, setOpenKapro] = useState(false)

    useEffect(() => {
        async function fetch() {
            try {
                setLoadingKapro(true)
                const response = await getGuru()
                const kapro = response.data.data.filter((guru: Guru) => guru.is_kaprog === true)
                setDataKapro(kapro)
            } catch (error) {
                console.log(error)
                toast.error('Gagal memuat data Kaprog')
            } finally {
                setLoadingKapro(false)
            }
        }
        fetch()
    }, [])

    const handleInputChange = (field: keyof JurusanFormData, value: string | number) => {
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

        if (!formData.kaprog_guru_id || formData.kaprog_guru_id === 0) {
            newErrors.kaprog_guru_id = 'Kepala program studi wajib dipilih'
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
            const jurusanData = {
                kode: formData.kode.trim().toUpperCase(),
                nama: formData.nama.trim(),
                kaprog_guru_id: formData.kaprog_guru_id,
                // Required API fields
                id: 0,
                created_at: '',
                updated_at: ''
            }

            const response = await createJurusan(jurusanData)

            if (response) {
                toast.success('Data jurusan berhasil dibuat!')
                router.push('/admin/jurusan')
            } else {
                toast.error('Gagal membuat data jurusan')
            }
        } catch (error) {
            console.error('Create jurusan error:', error)
            toast.error('Terjadi kesalahan saat membuat data jurusan')
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
        const hasChanges = formData.kode.trim() !== '' || formData.nama.trim() !== '' || formData.kaprog_guru_id !== 0
        if (hasChanges) {
            if (confirm('Ada data yang belum disimpan. Yakin ingin kembali?')) {
                router.push('/admin/jurusan')
            }
        } else {
            router.push('/admin/jurusan')
        }
    }

    const selectedKaprog = dataKapro.find((guru) => guru.id === formData.kaprog_guru_id)

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
                        <h1 className="text-3xl font-bold text-gray-900">Buat Data Jurusan</h1>
                        <p className="text-gray-600">Tambahkan program studi baru ke sistem</p>
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

                        {/* Kepala Program Studi */}
                        <div className="space-y-2">
                            <Label className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>Kepala Program Studi <span className="text-red-500">*</span></span>
                            </Label>
                            <Popover open={openKapro} onOpenChange={setOpenKapro}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openKapro}
                                        className={cn(
                                            "w-full justify-between",
                                            errors.kaprog_guru_id ? 'border-red-500' : ''
                                        )}
                                        disabled={loadingKapro}
                                    >
                                        {selectedKaprog
                                            ? `${selectedKaprog.nama} (${selectedKaprog.kode_guru})`
                                            : loadingKapro
                                            ? "Memuat..."
                                            : "Pilih Kepala Program Studi..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari Kaprog..." />
                                        <CommandList>
                                            <CommandEmpty>Kaprog tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {dataKapro.map((guru) => (
                                                    <CommandItem
                                                        key={guru.id}
                                                        value={`${guru.nama} ${guru.kode_guru} ${guru.nip}`}
                                                        onSelect={() => {
                                                            handleInputChange('kaprog_guru_id', guru.id)
                                                            setOpenKapro(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.kaprog_guru_id === guru.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{guru.nama}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {guru.kode_guru} - NIP: {guru.nip}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.kaprog_guru_id && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.kaprog_guru_id}
                                </p>
                            )}
                            <p className="text-sm text-gray-500">
                                Pilih guru yang akan menjabat sebagai Kepala Program Studi
                            </p>
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
                                <span>Simpan Data Jurusan</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
