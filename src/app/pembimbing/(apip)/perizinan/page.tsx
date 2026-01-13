import React from "react";

export default function PerizinanSiswa() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HEADER */}
      {/* <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#8B1E1E]">MagangHub</h1>
          <p className="text-sm text-gray-500">
            Ringkasan singkat mengenai sistem manajemen PKL Anda.
          </p>
        </div>

        <div className="flex items-center gap-4">
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
      </header> */}

      {/* CONTENT */}
      <div className="px-8 py-10 space-y-8">
        {/* FILTER */}
        <div className="bg-white border rounded-xl p-6 flex items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Industri <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Pilih Industri"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Kelas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Pilih Kelas"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <button className="bg-[#6B1B1B] text-white px-8 py-2 rounded-lg flex items-center gap-2">
            🔍 Cari...
          </button>

          <button className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
            🔄 Reset Filter
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Pengajuan Izin Peserta Didik
            </h2>
            <button className="text-sm text-blue-600">Lihat Semua</button>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/50"
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Nama Siswa</p>
                    <p className="text-sm text-gray-500">
                      XII RPL 1 • PT Teknologi Maju
                    </p>
                    <p className="text-sm">
                      Alasan: <span className="text-red-600">Sakit</span>
                    </p>
                  </div>
                </div>

                <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm">
                  Periksa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
