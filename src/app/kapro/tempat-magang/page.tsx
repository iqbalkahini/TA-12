"use client";

import { ListIndustri } from "@/api/kapro/indext";
import { deleteIndustri } from "@/api/admin/industri";
import { DaftarIndustriPreview } from "@/types/api";
import { useEffect, useState } from "react";
import { Building2, Plus, Search, AlertCircle, CheckCircle, Edit, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TempatMagangPage() {
    const [dataIndustri, setDataIndustri] = useState<DaftarIndustriPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIndustri, setSelectedIndustri] = useState<DaftarIndustriPreview | null>(null);

    // Quota Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quota, setQuota] = useState<number | null>(null);

    // Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [industryToDelete, setIndustryToDelete] = useState<DaftarIndustriPreview | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await ListIndustri(searchQuery);
                if (!response) {
                    console.log("error pada saat fetch data industri");
                    setDataIndustri([]);
                } else {
                    setDataIndustri(response.data);
                }
            } catch (error) {
                console.error("Error fetching industri:", error);
                setDataIndustri([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [refreshing]);

    const getStockStatus = (remaining: number | null, quota: number | null) => {
        if (quota === null || remaining === null) return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
        if (remaining === 0) return "bg-red-100 text-red-700 hover:bg-red-100/80";
        if (remaining <= quota * 0.3) return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
        return "bg-green-100 text-green-700 hover:bg-green-100/80";
    };

    const handleQuotaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/pkl/industri/${selectedIndustri?.industri_id}/quota`, {
                kuota_siswa: quota
            });
            toast.success("Kuota berhasil diperbarui");
            setRefreshing(!refreshing);
        } catch (error) {
            console.error("Error updating quota:", error);
            toast.warning("Gagal memperbarui kuota");
        } finally {
            setIsModalOpen(false);
        }
    }

    const handleDeleteClick = (item: DaftarIndustriPreview) => {
        setIndustryToDelete(item);
        setDeleteConfirmationText("");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSubmit = async () => {
        if (!industryToDelete) return;

        if (deleteConfirmationText !== industryToDelete.nama) {
            toast.error("Nama industri tidak cocok!");
            return;
        }

        setIsDeleting(true);
        try {
            const res = await deleteIndustri(industryToDelete.industri_id);
            if (res) {
                toast.success("Industri berhasil dihapus");
                setRefreshing(!refreshing);
            } else {
                toast.error("Gagal menghapus industri");
            }
        } catch (error) {
            console.error("Error deleting industri:", error);
            toast.error("Terjadi kesalahan saat menghapus industri");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setIndustryToDelete(null);
        }
    };

    return (
        <div className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm mx-4 md:mx-5 mt-5 mb-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-5">
                <div>
                    <h2 className="text-lg font-semibold">Daftar Tempat Magang</h2>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-72">
                        <input
                            type="text"
                            placeholder="Cari tempat magang..."
                            value={searchQuery}
                            onChange={(e) => {
                                if (e.target.value.length === 0) {
                                    setRefreshing(!refreshing);
                                }
                                setSearchQuery(e.target.value)
                            }}
                            className="pl-10 pr-4 py-2 border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button onClick={() => setRefreshing(!refreshing)}>Cari</Button>
                    <Button onClick={() => router.push('/kapro/tempat-magang/tambah')}><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Memuat data...</span>
                </div>
            ) : dataIndustri.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-gray-50">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                        {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data tempat magang'}
                    </p>
                </div>
            ) : (
                <div className="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">No</TableHead>
                                <TableHead>Nama Industri</TableHead>
                                <TableHead className="text-center">Kuota</TableHead>
                                <TableHead className="text-center">Pending</TableHead>
                                <TableHead className="text-center">Disetujui</TableHead>
                                <TableHead className="text-center">Aktif</TableHead>
                                <TableHead className="text-center">Sisa Slot</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataIndustri.map((item, index) => (
                                <TableRow key={item.industri_id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="text-center font-medium text-gray-500">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {item.nama}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="bg-white">
                                            {item.kuota_siswa ?? 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${item.pending_applications > 0 ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500'}`}>
                                            {item.pending_applications}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${item.approved_applications > 0 ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>
                                            {item.approved_applications}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${item.active_students > 0 ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>
                                            {item.active_students}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                        {item.remaining_slots ?? '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.kuota_siswa !== null && (
                                            <Badge className={getStockStatus(item.remaining_slots, item.kuota_siswa)}>
                                                {item.remaining_slots === 0 ? "Penuh" : "Tersedia"}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                title="Update Quota"
                                                onClick={() => {
                                                    setSelectedIndustri(item)
                                                    setQuota(item.kuota_siswa ?? 0)
                                                    setIsModalOpen(true)
                                                }}
                                            >
                                                <Settings className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0"
                                                title="Edit Industri"
                                                onClick={() => {
                                                    router.push(`/kapro/tempat-magang/edit/${item.industri_id}`)
                                                }}
                                            >
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500"
                                                title="Hapus Industri"
                                                onClick={() => handleDeleteClick(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog Update Quota */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Quota - {selectedIndustri?.nama}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleQuotaSubmit} className="space-y-4">
                        <Input
                            className="border p-2 w-full"
                            value={quota ?? ""}
                            type="number"
                            onChange={(e) =>
                                setQuota(Number(e.target.value))
                            }
                            placeholder="Masukkan kuota baru"
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Batal
                            </Button>

                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Delete Confirmation */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Industri?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data industri
                            <span className="font-bold text-gray-900"> {industryToDelete?.nama} </span>
                            secara permanen.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Ketik <span className="font-bold select-all">{industryToDelete?.nama}</span> untuk konfirmasi.
                        </p>
                        <Input
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            placeholder="Ketik nama industri disini..."
                            className="w-full"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                            disabled={deleteConfirmationText !== industryToDelete?.nama || isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus Industri"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
