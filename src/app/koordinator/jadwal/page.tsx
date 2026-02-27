"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeaderImage,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    MoreHorizontal,
    MoveRight,
    Package,
    Plus,
    Printer,
    Trash2,
    Truck,
    Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jadwalPkl } from "@/types/api";
import { deleteJadwal, getActiveTahunAjaran, getJadwalByTahunAjaran } from "@/api/koordinator";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";

export default function JadwalPage() {
    const [data, setData] = useState<jadwalPkl[]>([])
    const [tahunAjaranId, setTahunAjaranId] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [jadwalToDelete, setJadwalToDelete] = useState<jadwalPkl | null>(null)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const response = await getActiveTahunAjaran()
            setTahunAjaranId(response.id)
        }
        fetchData()
    }, [])
    const router = useRouter()
    const pathname = usePathname();


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getJadwalByTahunAjaran(tahunAjaranId)
                setData(res)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [tahunAjaranId])

    async function handleDeleteConfirm() {
        if (!jadwalToDelete?.id) return

        try {
            await deleteJadwal(jadwalToDelete.id)
            toast.success(`Jadwal ${jadwalToDelete.jenis_kegiatan} berhasil dihapus`)
            setData(data.filter(item => item.id !== jadwalToDelete.id))
            setIsDeleteDialogOpen(false)
            setJadwalToDelete(null)
            setDeleteConfirmText("")
        } catch (error) {
            console.log(error)
            toast.error("Gagal Menghapus Jadwal")
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Garis Waktu PKL</h1>
            </div>

            {/* Premium Horizontal Timeline UI */}
            {/* Timeline UI */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    {
                        title: "Pengantaran",
                        image: "/avatars/van-conversation.jpg",
                    },
                    {
                        title: "Monitoring",
                        image: "/avatars/conversation.jpg",
                    },
                    {
                        title: "Penjemputan",
                        image: "/avatars/04 penjemputan (1).png",
                    },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative w-32 h-32 mb-4">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="font-semibold text-sm md:text-base text-center">{item.title}</h3>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Content - Pengingat (Enhanced) */}
                <Card className="col-span-4 lg:col-span-5 h-fit">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Rentang Waktu</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 p-3">
                                        <Skeleton className="h-14 w-14 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                    </div>
                                ))
                            ) : data.length > 0 ? (
                                data.map((item, i) => {
                                    const configMap: Record<string, { icon: any, color: string, bg: string, border: string }> = {
                                        Pengantaran: { icon: Truck, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
                                        Monitoring: { icon: Users, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100" },
                                        Monitoring1: { icon: Users, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100" },
                                        Monitoring2: { icon: Users, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100" },
                                        Penjemputan: { icon: Package, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
                                    };

                                    const config = (item.jenis_kegiatan && configMap[item.jenis_kegiatan]) || { icon: Clock, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-100" };

                                    const mDate = new Date(item.tanggal_mulai);
                                    const sDate = new Date(item.tanggal_selesai);

                                    return (
                                        <div key={item.id} className="group flex items-start gap-4 rounded-xl bg-background p-3 border border-transparent transition-all hover:border-border hover:bg-muted/30 hover:shadow-sm">
                                            {/* Date Badge */}
                                            <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border ${config.bg} ${config.color} ${config.border} shadow-sm shrink-0`}>
                                                <span className="text-xl font-bold leading-none">{format(mDate, "dd")}</span>
                                                <span className="text-[10px] font-bold uppercase leading-none mt-1">{format(mDate, "MMM", { locale: idLocale })}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-foreground transition-colors">
                                                            {item.jenis_kegiatan == "Pembekalan" ? "Pengantaran" : item.jenis_kegiatan}
                                                        </p>
                                                        {item.status === "active" && (
                                                            <div className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                AKTIF
                                                            </div>
                                                        )}
                                                        {item.status === "completed" && (
                                                            <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                SELESAI
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                                                    {item.deskripsi}
                                                </p>

                                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground/80 font-semibold pt-1">
                                                    <div className="flex items-center bg-muted/50 px-2 py-0.5 rounded-md">
                                                        <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary/60" />
                                                        {format(mDate, "dd MMM yyyy", { locale: idLocale })}
                                                        {item.tanggal_mulai !== item.tanggal_selesai && (
                                                            <>
                                                                <span className="mx-1.5">sampai</span>
                                                                {format(sDate, "dd MMM yyyy", { locale: idLocale })}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                disabled={item.status !== 'active'}
                                                className={`h-10 rounded-lg mr-2 px-5 transition-all font-bold ${item.status === 'active' ? 'bg-[#8B1E1E] hover:bg-[#6e1818] text-white shadow-md shadow-[#8B1E1E]/10' : 'bg-gray-100 text-gray-400 border-transparent'}`}
                                                onClick={() => {
                                                    router.push(`/koordinator/jadwal/${item.id}/cetak`)
                                                }}
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                onClick={() => {
                                                    setJadwalToDelete(item)
                                                    setIsDeleteDialogOpen(true)
                                                    setDeleteConfirmText("")
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <CalendarDays className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-bold text-sm text-foreground">Tidak Ada Jadwal</h3>
                                    <p className="text-xs text-muted-foreground mt-1 px-4">Belum ada kegiatan yang dijadwalkan untuk tahun ajaran ini.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Sidebar - Aksi Cepat */}
                <div className="col-span-3 lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* <Button onClick={() => {
                                router.push(`${pathname}/pembekalan`)
                            }} variant='outline' className="w-full justify-start text-left h-auto py-3 whitespace-normal" size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                Tambah Jadwal Pembekalan
                            </Button> */}
                            <Button onClick={() => {
                                router.push(`${pathname}/pengantaran`)
                            }} variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Truck className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Pengantaran</span>
                            </Button>
                            <Button onClick={() => {
                                router.push(`${pathname}/monitoring`)
                            }} variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Users className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Monitoring</span>
                            </Button>
                            <Button onClick={() => {
                                router.push(`${pathname}/penjemputan`)
                            }} variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Package className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Penjemputan</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeaderImage>
                        <div className="p-3">
                            <img src="/avatars/man-trash.png" alt="Error" className=" h-24 object-cover" />
                        </div>
                    </AlertDialogHeaderImage>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Jadwal {jadwalToDelete?.jenis_kegiatan}?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4 pt-2">
                            <p>Tindakan ini tidak dapat dibatalkan. Seluruh data terkait jadwal ini akan dihapus secara permanen.</p>
                            <div className="space-y-2 rounded-lg bg-muted/50 p-3 border border-border/50">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Konfirmasi Penghapusan</Label>
                                <p className="text-xs">Ketik <span className="font-bold text-foreground">"{jadwalToDelete?.jenis_kegiatan}"</span> untuk melanjutkan:</p>
                                <Input
                                    placeholder="Ketik jenis kegiatan..."
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setJadwalToDelete(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteConfirmText !== jadwalToDelete?.jenis_kegiatan}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Hapus Jadwal
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
