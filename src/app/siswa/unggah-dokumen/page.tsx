'use client';

import { Upload, FileMinus, Info, Check } from 'lucide-react';
import { useState } from 'react';

export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        companyName: '',
        notes: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData, selectedFile);
        // Handle form submission logic here
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="ml-[70px] flex-1">

                {/* Dashboard Grid */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Main Card - Upload Section */}
                    <section className="bg-white border border-gray-200 rounded-xl p-8">
                        <h2 className="text-base font-semibold mb-6">Unggah Dokumen</h2>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center mb-6">
                            <Upload className="text-[40px] text-gray-300 mx-auto mb-4" />
                            <h3 className="text-[15px] mb-1">
                                Unggah surat penerimaan magang Anda
                            </h3>
                            <p className="text-[13px] text-gray-400">
                                Seret dan letakkan file Anda di sini, atau klik untuk menelusuri
                            </p>
                            <span className="block text-[10px] text-gray-300 uppercase mt-2">
                                Mendukung: PDF, JPG, PNG (Maks. 10MB)
                            </span>

                            <label className="inline-flex items-center gap-2 bg-[#7A1B1B] text-white px-5 py-2.5 rounded-md mt-5 cursor-pointer hover:bg-[#5A1515] transition-colors">
                                {/* <FaFolderOpen /> */}
                                <span className="text-[13px]">Telusuri File</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {selectedFile && (
                                <p className="mt-3 text-sm text-gray-600">
                                    File terpilih: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* Document Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5 text-gray-600">
                                        Tanggal Mulai Magang *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1B1B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5 text-gray-600">
                                        Tanggal Selesai Magang *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1B1B]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-gray-600">
                                    Nama Industri *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukan Nama Industri"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1B1B]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-gray-600">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Informasi tambahan apa pun tentang magang Anda..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1B1B] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-bold flex items-center justify-center gap-2.5 hover:bg-gray-400 transition-colors"
                            >
                                <Upload />
                                Unggah Dokumen
                            </button>
                        </form>
                    </section>

                    {/* Side Panel */}
                    <aside className="flex flex-col gap-6">
                        {/* Status Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                            <h3 className="text-sm mb-8">Status Unggahan</h3>
                            <div className="text-gray-200 py-5">
                                <FileMinus className="text-[40px] mx-auto mb-2.5" />
                                <p className="text-[11px] text-gray-400">
                                    Tidak ada file yang dipilih
                                </p>
                            </div>
                        </div>

                        {/* Guidelines Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-2.5 text-blue-800 mb-4">
                                <Info />
                                <h4 className="font-semibold">Pedoman</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Unggah surat penerimaan resmi atau email</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Dokumen harus menyertakan kop surat perusahaan</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Penyebutan tanggal magang yang jelas</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Ukuran file tidak boleh melebihi 10MB</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}