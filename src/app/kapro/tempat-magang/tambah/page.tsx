"use client"

import { createIndustri } from "@/api/admin/industri"
import { getJurusanKaproMe } from "@/api/admin/jurusan"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    nama: z.string().min(1, "Nama industri wajib diisi"),
    bidang: z.string().min(1, "Bidang usaha wajib diisi"),
    alamat: z.string().min(1, "Alamat lengkap wajib diisi"),
    pic: z.string().min(1, "Nama kontak person wajib diisi"),
    no_telp: z.string().min(1, "Nomor telepon wajib diisi"),
    pic_telp: z.string().min(1, "Nomor telepon PIC wajib diisi"),
    email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
    jurusan_id: z.string().min(1, "Jurusan wajib dipilih"),
})

export default function TambahIndustriPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: "",
            bidang: "",
            alamat: "",
            pic: "",
            no_telp: "",
            pic_telp: "",
            email: "",
            jurusan_id: "",
        },
    })

    useEffect(() => {
        const fetchJurusanKapro = async () => {
            try {
                const response = await getJurusanKaproMe()
                if (response?.success && response.data?.data && response.data.data.length > 0) {
                    const myJurusan = response.data.data[0]
                    form.setValue("jurusan_id", myJurusan.id.toString())
                } else {
                    toast.error("Tidak dapat menemukan data jurusan Anda")
                }
            } catch (error) {
                console.error("Error fetching jurusan kapro:", error)
                toast.error("Gagal memuat data jurusan")
            } finally {
                setInitialLoading(false)
            }
        }

        fetchJurusanKapro()
    }, [form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const payload: any = {
                ...values,
                jurusan_id: Number(values.jurusan_id),
                is_active: true,
            }

            const res = await createIndustri(payload)
            if (res) {
                toast.success("Berhasil menambahkan tempat magang baru")
                router.push("/kapro/tempat-magang")
                router.refresh()
            } else {
                toast.error("Gagal menambahkan tempat magang")
            }
        } catch (error) {
            console.error("Error creating industri:", error)
            toast.error("Terjadi kesalahan saat menyimpan data")
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="p-6">
            <Card className="border-t-4 border-t-blue-500 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Tambah Tempat Magang Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Industri */}
                                <FormField
                                    control={form.control}
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Nama Industri <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan nama industri" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Bidang Usaha */}
                                <FormField
                                    control={form.control}
                                    name="bidang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Bidang Usaha <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan Bidang Usaha" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Alamat Lengkap */}
                            <FormField
                                control={form.control}
                                name="alamat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Alamat Lengkap <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Masukkan alamat lengkap"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kontak Person */}
                                <FormField
                                    control={form.control}
                                    name="pic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Kontak Person <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama kontak person" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Nomor Telepon */}
                                <FormField
                                    control={form.control}
                                    name="no_telp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Nomor Telepon <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nomor telepon" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* PIC Telp */}
                                <FormField
                                    control={form.control}
                                    name="pic_telp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Nomor Telepon PIC <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nomor telepon PIC" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email industri" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="w-32"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-32 bg-[#5d171b] hover:bg-[#4a1216] text-white"
                                    disabled={loading}
                                >
                                    {loading ? "Tambah" : "Tambah"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}