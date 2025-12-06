"use client";

import { ListIndustri } from "@/api/kapro/indext";
import { DaftarIndustriPreview } from "@/types/api";
import { useEffect, useState } from "react";
import { Building2, Users, UserCheck, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function TempatMagangPage() {
    const [dataIndustri, setDataIndustri] = useState<DaftarIndustriPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await ListIndustri();
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
    }, []);

    const filteredData = dataIndustri.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const getStatusColor = (remaining: number | null, quota: number | null) => {
        if (quota === null || remaining === null) return "bg-gray-100 text-gray-700";
        if (remaining === 0) return "bg-red-100 text-red-700";
        if (remaining <= quota * 0.3) return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-sm mx-5 mt-5 mb-5">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-lg font-semibold">Daftar Tempat Magang</h2>
                    <p className="text-sm text-gray-500">Data industri yang bekerja sama untuk PKL</p>
                </div>

                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="Cari tempat magang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Memuat data...</span>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                        {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data tempat magang'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {filteredData.map((item) => (
                            <div
                                key={item.industri_id}
                                className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{item.nama}</h3>
                                        </div>
                                    </div>
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
                                                    Penuh
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    Tersedia
                                                </>
                                            )}
                                        </span>
                                    )}
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

                    <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                        <p>Menampilkan {filteredData.length} dari {dataIndustri.length} data</p>
                    </div>
                </>
            )}
        </div>
    );
}
