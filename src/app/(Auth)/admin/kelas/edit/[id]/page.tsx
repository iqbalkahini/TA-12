'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getKelasById, updateKelas } from "@/api/admin/kelas"
import { getJurusan } from "@/api/admin/jurusan"
import { ArrowLeft, Save, School, AlertCircle, Users, Check } from "lucide-react"
import { toast } from "sonner"

interface KelasFormData {
    nama: string
    jurusan_id: number
}

interface JurusanOption {
    id: number
    kode: string
    nama: string
}

const initialFormData: KelasFormData = {
    nama: '',
    jurusan_id: 0
}

export default function EditKelasPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [loadingJurusan, setLoadingJurusan] = useState(true)
    const [formData, setFormData] = useState<KelasFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof KelasFormData, string>>>({})
    const [jurusanOptions, setJurusanOptions] = useState<JurusanOption[]>([])
    const [open, setOpen] = useState(false)

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

    // Load kelas data
    useEffect(() => {
        const loadKelasData = async () => {
            try {
                setLoadingData(true)
                const response = await getKelasById(parseInt(id))

                if (response && response.data) {
                    const kelasData = response.data
                    setFormData({
                        nama: kelasData.nama || '',
                        jurusan_id: kelasData.jurusan_id || 0
                    })
                } else {
                    toast.error('Data kelas tidak ditemukan')
                    router.push('/admin/kelas')
                }
            } catch (error) {
                console.error('Load kelas error:', error)
                toast.error('Gagal memuat data kelas')
                router.push('/admin/kelas')
            } finally {
                setLoadingData(false)
            }
        }

        if (id) {
            loadKelasData()
        }
    }, [id, router])

    const handleInputChange = (field: keyof KelasFormData, value: string | number) => {
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
        const newErrors: Partial<Record<keyof KelasFormData, string>> = {}

        // Required fields validation
        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama kelas wajib diisi'
        } else if (formData.nama.trim().length < 2) {
            newErrors.nama = 'Nama kelas minimal 2 karakter'
        } else if (formData.nama.trim().length > 50) {
            newErrors.nama = 'Nama kelas maksimal 50 karakter'
        }

        if (!formData.jurusan_id || formData.jurusan_id === 0) {
            newErrors.jurusan_id = 'Jurusan wajib dipilih'
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

            const kelasData = {
                nama: formData.nama.trim(),
                jurusan_id: formData.jurusan_id,
                // Required API fields
                id: parseInt(id),
                created_at: '',
                updated_at: ''
            }

            const response = await updateKelas(parseInt(id), kelasData)

            if (response) {
                toast.success('Data kelas berhasil diperbarui!')
                router.push('/admin/kelas')
            } else {
                toast.error('Gagal memperbarui data kelas')
            }
        } catch (error) {
            console.error('Update kelas error:', error)
            toast.error('Terjadi kesalahan saat memperbarui data kelas')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        router.push('/admin/kelas')
    }

    const getSelectedJurusan = () => {
        return jurusanOptions.find(j => j.id === formData.jurusan_id)
    }

    if (loadingData) {
        return (
            <AdminLayout onLogout={handleLogout}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memuat data kelas...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Data Kelas</h1>
                            <p className="text-gray-600">Perbarui informasi kelas dalam sistem</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <School className="h-5 w-5" />
                                <span>Informasi Kelas</span>
                            </CardTitle>
                            <CardDescription>
                                Data dasar kelas untuk sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama" className="flex items-center space-x-1">
                                        <Users className="h-4 w-4" />
                                        <span>Nama Kelas <span className="text-red-500">*</span></span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={formData.nama}
                                        onChange={(e) => handleInputChange('nama', e.target.value)}
                                        placeholder="e.g., XII RPL 1, XI TKJ 2"
                                        className={errors.nama ? 'border-red-500' : ''}
                                        maxLength={50}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jurusan_id">
                                        Jurusan <span className="text-red-500">*</span>
                                    </Label>
                                     {loadingJurusan ? (
                                         <div className="flex items-center justify-center h-10 border rounded-md bg-gray-50">
                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                             <span className="ml-2 text-sm text-gray-500">Memuat jurusan...</span>
                                         </div>
                                     ) : (
                                         <Popover open={open} onOpenChange={setOpen}>
                                             <PopoverTrigger asChild>
                                                 <Button
                                                     variant="outline"
                                                     role="combobox"
                                                     aria-expanded={open}
                                                     className={`w-full justify-between ${errors.jurusan_id ? 'border-red-500' : ''} ${!formData.jurusan_id || formData.jurusan_id === 0 ? 'text-muted-foreground' : ''}`}
                                                     disabled={loadingJurusan}
                                                 >
                                                     {formData.jurusan_id && formData.jurusan_id !== 0
                                                         ? jurusanOptions.find((jurusan) => jurusan.id === formData.jurusan_id)?.nama
                                                         : "Pilih jurusan..."}
                                                     <School className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                 </Button>
                                             </PopoverTrigger>
                                             <PopoverContent className="w-full p-0">
                                                 <Command>
                                                     <CommandInput placeholder="Cari jurusan..." />
                                                     <CommandList>
                                                         <CommandEmpty>Jurusan tidak ditemukan.</CommandEmpty>
                                                         <CommandGroup>
                                                             {jurusanOptions.map((jurusan) => (
                                                                  <CommandItem
                                                                      key={jurusan.id}
                                                                      value={`${jurusan.kode} ${jurusan.nama}`}
                                                                      onSelect={() => {
                                                                          handleInputChange('jurusan_id', jurusan.id)
                                                                          setOpen(false)
                                                                      }}
                                                                  >
                                                                      <Check className={`mr-2 h-4 w-4 ${formData.jurusan_id === jurusan.id ? 'opacity-100' : 'opacity-0'}`} />
                                                                      <div className="flex items-center space-x-2">
                                                                          <span className="font-mono text-sm font-semibold">
                                                                              {jurusan.kode}
                                                                          </span>
                                                                          <span>-</span>
                                                                          <span>{jurusan.nama}</span>
                                                                      </div>
                                                                  </CommandItem>
                                                             ))}
                                                         </CommandGroup>
                                                     </CommandList>
                                                 </Command>
                                             </PopoverContent>
                                         </Popover>
                                     )}
                                    {errors.jurusan_id && (
                                        <p className="text-sm text-red-500 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.jurusan_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end">
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
                                    <span>Perbarui Data Kelas</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
