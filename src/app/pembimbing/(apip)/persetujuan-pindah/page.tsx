"use client";

import React, { useState } from 'react';
import { Check, CheckCircle, AlertCircle } from 'lucide-react';

export default function PindahPkl() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Aksi berhasil diproses.");

    // Handlers
    const handleTolak = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission if button is inside form
        setShowConfirmModal(true);
    };

    const confirmTolak = () => {
        setShowConfirmModal(false);
        setSuccessMessage("Pengajuan telah ditolak.");
        setShowSuccessModal(true);
    };

    const handleIzinkan = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("Pengajuan telah disetujui.");
        setShowSuccessModal(true);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#333]">
            <div className="max-w-[1200px] mx-auto px-5 py-10">

                {/* STATUS CARD */}
                <div className="bg-white rounded-2xl p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-[30px] border border-[#eef0f2]">
                    <h3 className="text-[18px] mb-[35px] text-[#641E20] font-semibold uppercase tracking-wider">
                        Status Persetujuan
                    </h3>

                    <div className="relative flex justify-between px-[50px] overflow-hidden">
                        {/* Lines */}
                        <div className="absolute top-[40px] left-[10%] w-[80%] h-1 bg-[#eee] z-0"></div>
                        <div className="absolute top-[40px] left-[10%] w-[53%] h-1 bg-[#b8860b] z-10"></div>

                        {/* Step 1: Pembimbing */}
                        <div className="flex flex-col items-center z-20 w-[120px]">
                            <span className="text-[13px] font-semibold text-[#444] mb-[15px]">Pembimbing</span>
                            <div className="w-5 h-5 bg-[#b8860b] rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                <Check size={12} strokeWidth={4} />
                            </div>
                        </div>

                        {/* Step 2: Kapro */}
                        <div className="flex flex-col items-center z-20 w-[120px]">
                            <span className="text-[13px] font-semibold text-[#444] mb-[15px]">Kapro</span>
                            <div className="w-5 h-5 bg-[#b8860b] rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                <Check size={12} strokeWidth={4} />
                            </div>
                        </div>

                        {/* Step 3: Koordinator */}
                        <div className="flex flex-col items-center z-20 w-[120px]">
                            <span className="text-[13px] font-semibold text-[#444] mb-[15px]">Koordinator</span>
                            <div className="w-5 h-5 bg-[#ccc] rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                {/* Inactive */}
                            </div>
                        </div>

                        {/* Step 4: Selesai */}
                        <div className="flex flex-col items-center z-20 w-[120px]">
                            <button className="px-[15px] py-[5px] bg-[#eee] text-[#aaa] text-[10px] cursor-default rounded-full font-bold mt-[25px]">
                                SELESAI
                            </button>
                        </div>
                    </div>
                </div>

                {/* FORM CARD */}
                <section className="bg-white rounded-2xl p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-[30px] border border-[#eef0f2]">
                    <h3 className="text-[18px] mb-[35px] text-[#641E20] font-semibold uppercase tracking-wider">
                        Detail Pengajuan Pindah PKL
                    </h3>

                    <form onSubmit={handleIzinkan}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">

                            <div className="flex flex-col gap-2.5 md:col-span-2">
                                <label className="text-[13px] font-semibold text-[#555]">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value="Iqbal Lazuardi"
                                    readOnly
                                    className="p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-semibold text-[#555]">Jurusan</label>
                                <input
                                    type="text"
                                    value="Rekayasa Perangkat Lunak"
                                    readOnly
                                    className="p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-semibold text-[#555]">Kelas</label>
                                <input
                                    type="text"
                                    value="XI RPL 1"
                                    readOnly
                                    className="p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-semibold text-[#555]">Tempat Magang Saat Ini</label>
                                <input
                                    type="text"
                                    value="UBIG"
                                    readOnly
                                    className="p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-semibold text-[#555]">Tempat Magang Tujuan</label>
                                <input
                                    type="text"
                                    value="PT. Peternakan Kambing"
                                    readOnly
                                    className="p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2.5 md:col-span-2">
                                <label className="text-[13px] font-semibold text-[#555]">Alasan Perpindahan</label>
                                <textarea
                                    value="Mental rusak karena pembimbing yang terlalu menekan serta tugas di luar keahlian."
                                    readOnly
                                    className="h-[120px] resize-y p-[14px_18px] border border-[#d1d1d1] rounded-xl text-[14px] bg-[#f9f9f9] text-[#333] outline-none"
                                />
                            </div>

                        </div>

                        <div className="flex justify-center gap-[25px] mt-10">
                            <button
                                type="button"
                                onClick={handleTolak}
                                className="px-[60px] py-[14px] rounded-[30px] border-none font-semibold text-white cursor-pointer transition-all duration-300 text-[14px] bg-[#d93025] hover:bg-[#b71c1c] shadow-lg shadow-red-200"
                            >
                                Tolak
                            </button>
                            <button
                                type="submit"
                                className="px-[60px] py-[14px] rounded-[30px] border-none font-semibold text-white cursor-pointer transition-all duration-300 text-[14px] bg-[#0f9d58] hover:bg-[#0b8043] shadow-lg shadow-green-200 hover:-translate-y-0.5"
                            >
                                Izinkan
                            </button>
                        </div>
                    </form>
                </section>

            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
                    <div className="bg-white w-[400px] rounded-[25px] p-[35px] text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-[120px] h-[120px] bg-red-100 rounded-full mx-auto mb-[15px] flex items-center justify-center">
                            <AlertCircle className="w-[60px] h-[60px] text-[#d93025]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#333] mb-[10px]">
                            Apakah anda yakin ingin <b className="text-[#d93025]">menolak</b> pengajuan pindah PKL ini?
                        </h3>
                        <div className="flex justify-center gap-[20px] mt-[25px]">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-[35px] py-[10px] rounded-[30px] font-semibold text-white bg-[#0f9d58] hover:bg-[#0b8043] transition-colors"
                            >
                                Tidak
                            </button>
                            <button
                                onClick={confirmTolak}
                                className="px-[35px] py-[10px] rounded-[30px] font-semibold text-white bg-[#d93025] hover:bg-[#b71c1c] transition-colors"
                            >
                                Iya
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
                    <div className="bg-white w-[400px] rounded-[25px] p-[35px] text-center animate-in fade-in zoom-in duration-200">
                        <CheckCircle className="w-[50px] h-[50px] text-[#4CAF50] mx-auto mb-[15px]" />
                        <h3 className="text-[18px] font-bold text-[#333]">Berhasil!</h3>
                        <p className="mt-[10px] text-[#666]">{successMessage}</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="mt-[25px] px-[40px] py-[10px] rounded-[30px] font-semibold text-white bg-[#0f9d58] hover:bg-[#0b8043] transition-colors"
                        >
                            Oke
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}