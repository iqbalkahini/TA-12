import React from "react";

export default function PermasalahanSiswa() {
    return (
        <div className="flex-1 bg-[#fafafa] min-h-screen">
            {/* HEADERr */}
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B1E1E]">MagangHub</h1>
                    <p className="text-sm text-gray-500">
                        Ringkasan singkat mengenai sistem manajemen PKL Anda.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Bell */}
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.6 1.4L4 17h5"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            3
                        </span>
                    </div>

                    {/* Gear */}
                    <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.3 1.9l.7 2.1a8 8 0 012.6 0l.7-2.1 2.2.9-.9 2.1a8 8 0 011.8 1.8l2.1-.9.9 2.2-2.1.7a8 8 0 010 2.6l2.1.7-.9 2.2-2.1-.9a8 8 0 01-1.8 1.8l.9 2.1-2.2.9-.7-2.1a8 8 0 01-2.6 0l-.7 2.1-2.2-.9.9-2.1a8 8 0 01-1.8-1.8l-2.1.9-.9-2.2 2.1-.7a8 8 0 010-2.6l-2.1-.7.9-2.2 2.1.9a8 8 0 011.8-1.8l-.9-2.1 2.2-.9z"
                        />
                    </svg>
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-8 py-10">
                <div className="max-w-4xl mx-auto bg-white border rounded-xl p-8">
                    <h2 className="text-xl font-semibold mb-6">
                        Permasalahan Siswa
                    </h2>

                    {/* Nama Siswa */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Nama Siswa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Masukan nama siswa"
                            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                    </div>

                    {/* Permasalahan */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">
                            Permasalahan Siswa <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={6}
                            placeholder="Masukan permasalahan siswa"
                            className="w-full border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                    </div>

                    {/* Button */}
                    <button className="w-full bg-[#6B1B1B] hover:bg-[#5a1616] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M22 2L11 13"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M22 2l-7 20-4-9-9-4 20-7z"
                            />
                        </svg>
                        Kirim Pengaduan Masalah
                    </button>
                </div>
            </div>
        </div>
    );
}
