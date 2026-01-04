import { Send } from "lucide-react";

export default function PindahPklPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* FORM SECTION */}
                <div className="bg-white rounded-lg shadow-md p-8">

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Form Pengajuan Pindah PKL</h2>
                    <p className="text-gray-600 text-sm mb-8">
                        Harap isi semua informasi yang diperlukan untuk permohonan magang Anda.
                    </p>

                    {/* DATA SISWA */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-8 pb-2 border-b-2 border-blue-500">Data Siswa</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap Anda"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                NISN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan NISN Anda"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jurusan <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Pilih Jurusan Anda</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kelas <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan Kelas Anda"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alamat <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Masukkan alamat lengkap Anda"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                No. Telp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nomor telepon Anda"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kontak Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Masukkan Email Anda"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* MASALAH */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Masalah <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Jelaskan masalah Anda di sini"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    {/* DATA INDUSTRI */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-10 pb-2 border-b-2 border-blue-500">Data Industri</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Industri <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama industri"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal Permohonan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alamat Industri <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Masukkan alamat lengkap industri"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kontak Industri <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama & kontak penanggung jawab"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lampiran (Optional)
                        </label>
                        <input
                            type="file"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-gray-200">
                        <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Simpan sebagai Draft
                        </button>
                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <Send size={18} /> Kirim Permohonan
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}