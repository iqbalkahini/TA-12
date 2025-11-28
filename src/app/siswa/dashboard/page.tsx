import Image from "next/image";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Notification */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <p>
                    Batas waktu pendaftaran PKL semakin dekat. Pastikan Anda mengirimkan aplikasi
                    Anda sebelum <strong>15 Maret 2024</strong>.
                </p>
            </div>

            {/* Profile & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Profil Peserta didik</h2>
                    <p className="text-sm text-gray-500 mb-6">Informasi Pribadi</p>

                    <div className="flex items-center gap-4 mb-6">
                        <Image src="/logo/logo_header.png" alt="logo" width={80} height={80} />
                        <div>
                            <p className="font-medium text-gray-800">Sarah Johnson</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div className="text-gray-500">Nama Lengkap</div>
                        <div className="font-medium">Sarah Johnson</div>

                        <div className="text-gray-500">NISN</div>
                        <div className="font-medium">20210001</div>

                        <div className="text-gray-500">Kelas</div>
                        <div className="font-medium">XII - RPL 1</div>

                        <div className="text-gray-500">Jurusan</div>
                        <div className="font-medium">Software Engineering</div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Status Magang</h2>
                    <p className="text-sm text-gray-500 mb-6">Status Permohonan Saat Ini</p>

                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl text-sm">
                        <p className="font-medium">Menunggu Persetujuan</p>
                    </div>

                    <div className="mt-6 text-sm space-y-2">
                        <p className="font-medium">Garis Waktu Permohonan :</p>
                        <div className="flex justify-between">
                            <span className="text-green-600 font-medium">● Permohonan Telah Dikirim</span>
                            <span>Mar 10, 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-yellow-600 font-medium">● Sedang Ditinjau</span>
                            <span>Saat ini</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">● Keputusan Persetujuan</span>
                            <span>Tertunda</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Permohonan Baru
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Unggah Document
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Lihat Jadwal
                </button>
                <button className="bg-white p-6 rounded-2xl shadow-sm border hover:bg-gray-50 transition text-center text-sm font-medium">
                    Kontak Pembimbing
                </button>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span>📄 Permohonan Magang Telah Dikirim</span>
                        <span className="text-gray-500">2 Hari yang lalu</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span>✔️ Profil Diperbarui</span>
                        <span className="text-gray-500">1 Minggu yang lalu</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span>🔔 Pemberitahuan Sistem</span>
                        <span className="text-gray-500">1 Minggu yang lalu</span>
                    </div>
                </div>
            </div>
        </div>
    );
}