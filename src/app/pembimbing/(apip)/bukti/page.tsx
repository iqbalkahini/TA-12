import React from "react";

export default function UploadDokumenBukti() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex">
      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* HEADER */}
        {/* <header className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#6B0F0F]">MagangHub</h1>
            <p className="text-sm text-gray-500">
              Ringkasan singkat mengenai sistem manajemen PKL Anda.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                🔔
              </button>
              <span className="absolute -top-1 -right-1 bg-[#c1272d] text-white text-xs rounded-full px-1.5">
                3
              </span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              ⚙️
            </button>
          </div>
        </header> */}

        {/* CONTENT */}
        <div className="p-8 space-y-10">
          {/* UPLOAD SECTION */}
          <section className="border rounded-xl p-6 space-y-6 max-w-4xl">
            <h2 className="text-lg font-semibold">Upload Dokumen Bukti</h2>

            <div>
              <label className="text-sm font-medium">
                Upload File <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 border-2 border-dashed rounded-xl py-10 flex flex-col items-center text-gray-500">
                <div className="w-10 h-10 bg-gray-300 rounded mb-2" />
                <p>Drag & drop file atau klik untuk browse</p>
                <button className="mt-3 px-4 py-2 border rounded">
                  Browse File
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-[#6B0F0F] text-white px-6 py-2 rounded-lg">
                Upload Dokumen
              </button>
            </div>
          </section>

          {/* TABLE SECTION */}
          <section className="border rounded-xl p-6 space-y-4 max-w-6xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Daftar Dokumen</h2>

              <div className="flex gap-3">
                <select className="border rounded-lg px-3 py-2">
                  <option>Semua Jenis</option>
                </select>

                <input
                  type="text"
                  placeholder="Cari dokumen..."
                  className="border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="overflow-hidden border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Jenis Dokumen</th>
                    <th className="px-4 py-3 text-left">Nama File</th>
                    <th className="px-4 py-3 text-left">Tanggal Upload</th>
                    <th className="px-4 py-3 text-left">Catatan</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Bukti Pengantaran
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      pengantaran_pkl_2024.pdf
                    </td>
                    <td className="px-4 py-3">15 Nov 2024</td>
                    <td className="px-4 py-3">
                      Dokumen pengantaran siswa ke PT ABC
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded">
                        Lihat
                      </button>
                      <button className="bg-[#6B0F0F] text-white px-3 py-1 rounded">
                        Cetak
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">
                        Hapus
                      </button>
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        Bukti Monitoring
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      monitoring_pkl_nov.pdf
                    </td>
                    <td className="px-4 py-3">12 Nov 2024</td>
                    <td className="px-4 py-3">
                      Monitoring minggu kedua PKL
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded">
                        Lihat
                      </button>
                      <button className="bg-[#6B0F0F] text-white px-3 py-1 rounded">
                        Cetak
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">
                        Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm">
              <p>Menampilkan 1–3 dari 7 Permohonan</p>
              <div className="flex gap-2">
                <button className="border px-3 py-1 rounded">
                  Previous
                </button>
                <button className="bg-[#6B0F0F] text-white px-3 py-1 rounded">
                  1
                </button>
                <button className="border px-3 py-1 rounded">
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
