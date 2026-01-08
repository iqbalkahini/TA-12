import React from "react";

export default function DetailPermasalahan() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/*Header*/}
      <header className="border-b px-8 py-4">
        <h1 className="text-xl font-bold text-[#6B0F0F]">MagangHub</h1>
        <p className="text-sm text-gray-500">
          Ringkasan singkat mengenai sistem manajemen PKL Anda.
        </p>
      </header>

      {/*Content*/}
      <main className="px-8 py-10">
        <div className="max-w-5xl mx-auto border rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-8">Detail Permasalahan</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Peserta Didik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value="Iqbal Lazuardi"
                readOnly
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Kelas 12"
                  readOnly
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Rekayasa Perangkat Lunak"
                  readOnly
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tanggal Pengaduan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="27/11/2025"
                  readOnly
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="UBIG"
                  readOnly
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Detail Permasalahan <span className="text-red-500">*</span>
              </label>
              <textarea
                readOnly
                rows= {5}
                className="w-full border rounded-lg px-4 py-3"
                value="Saya merasa tidak betah berada di industri"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
