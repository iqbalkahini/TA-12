"use client";

import { ListIndustri } from "@/api/kapro/indext";
import { DaftarIndustriPreview } from "@/types/api";
import { useEffect, useState } from "react";
import { Building2, Users, UserCheck, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

export default function TempatMagangPage() {
    const [dataIndustri, setDataIndustri] = useState<DaftarIndustriPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIndustri, setSelectedIndustri] = useState<DaftarIndustriPreview | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quota, setQuota] = useState<number | null>(null);

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

    const getStatusColor = (remaining: number | null, quota: number | null) => {
        if (quota === null || remaining === null) return "bg-gray-100 text-gray-700";
        if (remaining === 0) return "bg-red-100 text-red-700";
        if (remaining <= quota * 0.3) return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Updating quota to:", selectedIndustri?.industri_id);
            console.log("Quota:", quota);
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
        // Logic to update quota goes here
    }

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
                    <Button onClick={() => setRefreshing(!refreshing)}>Search</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Memuat data...</span>
                </div>
            ) : dataIndustri.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                        {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data tempat magang'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {dataIndustri.map((item) => (
                            <div
                                key={item.industri_id}
                                className="border rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 md:gap-0">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{item.nama}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pl-[3.25rem] md:pl-0 justify-between md:justify-end w-full md:w-auto">
                                        <Button
                                            className="h-8 text-xs"
                                            variant='outline'
                                            onClick={() => {
                                                setSelectedIndustri(item)
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            Update Quota
                                        </Button>

                                        {item.kuota_siswa !== null && (
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    item.remaining_slots,
                                                    item.kuota_siswa
                                                )}`}
                                            >
                                                {item.remaining_slots === 0 ? (
                                                    <>
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span className="hidden sm:inline">Penuh</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span className="hidden sm:inline">Tersedia</span>
                                                    </>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="bg-white rounded-lg p-3 border">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-medium">Kuota</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.kuota_siswa ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-3 border">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-medium">Pending</span>
                                        </div>
                                        <p className="text-lg font-semibold text-yellow-600">
                                            {item.pending_applications}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-3 border">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-xs font-medium">Disetujui</span>
                                        </div>
                                        <p className="text-lg font-semibold text-green-600">
                                            {item.approved_applications}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-3 border">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <UserCheck className="w-4 h-4" />
                                            <span className="text-xs font-medium">Aktif</span>
                                        </div>
                                        <p className="text-lg font-semibold text-blue-600">
                                            {item.active_students}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-3 border">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-medium">Sisa Slot</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.remaining_slots ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                        <p>Menampilkan {dataIndustri.length} dari {dataIndustri.length} data</p>
                    </div> */}
                </>
            )}
            {/* Dialog Update Quota */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Data</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
    );
}
