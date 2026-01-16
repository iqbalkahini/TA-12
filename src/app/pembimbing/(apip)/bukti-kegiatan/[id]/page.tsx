"use client"

import { getRealisasiKegiatanPklById } from "@/api/pembimbing"
import { IBuktiKegiatan } from "@/types/api"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { ArrowLeft, Calendar, CheckCircle2, Clock, ImageIcon, User, Building } from "lucide-react"
import Image from "next/image"

export default function BuktiKegiatanDetail() {
    const [data, setData] = useState<IBuktiKegiatan | null>(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const router = useRouter()

    const fetch = async () => {
        try {
            setLoading(true)
            const res = await getRealisasiKegiatanPklById(Number(id))
            setData(res)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetch()
        }
    }, [id])

    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Data Tidak Ditemukan</h3>
                <p className="text-gray-500 mt-2 mb-6">Bukti kegiatan yang Anda cari tidak tersedia.</p>
                <Button onClick={() => router.back()}>Kembali</Button>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 animate-in fade-in-50 duration-500">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detail Realisasi Kegiatan</h1>
                    <p className="text-gray-500 text-sm">Lihat detail laporan kegiatan industri</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Main Info Card */}
                <Card className="border-none shadow-lg bg-white overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-blue-700 font-medium">
                            <Calendar className="w-5 h-5" />
                            <span>
                                {format(new Date(data.tanggal_realisasi), "EEEE, d MMMM yyyy", { locale: idLocale })}
                            </span>
                        </div>
                        <Badge
                            variant={data.status === "Selesai" || data.status === "Disetujui" ? "default" : "secondary"}
                            className={`${data.status === "Selesai" || data.status === "Disetujui"
                                ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                                } px-3 py-1 text-xs uppercase tracking-wide font-semibold shadow-sm`}
                        >
                            {data.status || "Pending"}
                        </Badge>
                    </div>

                    <CardContent className="p-6 space-y-8">
                        {/* Metadata Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2    bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm text-gray-500">
                                    <Building className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID Industri</p>
                                    <p className="text-sm font-semibold text-gray-900">#{data.industri_id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID Kegiatan</p>
                                    <p className="text-sm font-semibold text-gray-900">#{data.kegiatan_id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Section */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                Catatan Kegiatan
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-sm lg:text-base">
                                {data.catatan || (
                                    <span className="text-gray-400 italic">-</span>
                                )}
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                Bukti Foto ({data.bukti_foto_urls?.length || 0})
                            </h3>

                            {data.bukti_foto_urls && data.bukti_foto_urls.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data.bukti_foto_urls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <Image
                                                src={url}
                                                alt={`Bukti kegiatan ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-center text-sm">Belum ada bukti foto yang diunggah</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between text-xs text-gray-400 gap-2">
                            <span>Dibuat: {format(new Date(data.created_at), "d MMM yyyy HH:mm", { locale: idLocale })}</span>
                            <span>Terakhir Update: {format(new Date(data.updated_at), "d MMM yyyy HH:mm", { locale: idLocale })}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}