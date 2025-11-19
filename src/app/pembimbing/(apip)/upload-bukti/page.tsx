"use client";

import { useState } from "react";

export default function UploadBukti() {
  const [dokumen] = useState([
    {
      jenis: "Bukti Pengantaran",
      file: "pengantaran_pkl_2024.pdf",
      tanggal: "15 Nov 2024",
      catatan: "Dokumen pengantaran siswa ke PT ABC",
    },
    {
      jenis: "Bukti Monitoring",
      file: "monitoring_pkl_nov.pdf",
      tanggal: "12 Nov 2024",
      catatan: "Monitoring minggu kedua PKL",
    },
  ]);

  return (
    <div className="min-h-screen flex bg-[#F8F8F8] font-inter">

      {/* SIDEBAR */}
      <aside className="w-[75px] bg-[#6B1E1E] flex flex-col items-center py-4">
        <img src="/magang.png" className="w-10 h-10 mb-6" />

        {/* Sidebar Menu Icon */}
        <div className="flex flex-col gap-7 text-white text-lg">
          <span className="cursor-pointer hover:text-gray-300">🏠</span>
          <span className="cursor-pointer hover:text-gray-300">📄</span>
          <span className="cursor-pointer hover:text-gray-300">📝</span>
          <span className="cursor-pointer hover:text-gray-300">📅</span>
          <span className="cursor-pointer hover:text-gray-300">⚙️</span>
        </div>

        <div className="mt-auto mb-3">
          <img src="/profile.jpg" className="w-12 h-12 rounded-full border border-white" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">

        {/* HEADER */}
        <header className="w-full bg-white h-[70px] px-6 flex justify-between items-center border-b">
          <div>
            <h1 className="font-semibold text-lg text-[#6B1E1E]">MagangHub</h1>
            <p className="text-xs text-gray-500 -mt-1">
              Ringkasan singkat mengenai sistem manajemen PKL Anda.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xl text-gray-700 cursor-pointer">
            <div className="relative">
              🔔
              <span className="absolute -top-1 -right-2 bg-red-600 text-white px-[5px] text-xs rounded-full">
                3
              </span>
            </div>
            ⚙️
          </div>
        </header>

        {/* CONTENT WRAPPER */}
        <div className="px-10 py-6">

          {/* FORM CARD */}
          <div className="bg-white rounded-xl shadow-sm p-7 border">

            <h2 className="font-semibold text-lg mb-6">Upload Dokumen Bukti</h2>

            {/* FORM GRID */}
            <div className="grid grid-cols-2 gap-6">

              {/* Jenis dokumen */}
              <div>
                <label className="text-sm text-gray-700 font-medium">Jenis Dokumen *</label>
                <select className="w-full border mt-2 p-3 rounded-lg text-sm bg-gray-50 focus:ring focus:ring-[#6B1E1E]/20">
                  <option>Pilih Jenis Dokumen</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-700 font-medium">Tanggal *</label>
                <input
                  type="date"
                  className="w-full mt-2 p-3 rounded-lg border bg-gray-50 text-sm focus:ring focus:ring-[#6B1E1E]/20"
                />
              </div>
            </div>

            {/* Catatan */}
            <div className="mt-5">
              <label className="text-sm text-gray-700 font-medium">Catatan Tambahan *</label>
              <textarea
                placeholder="Masukkan catatan atau keterangan tambahan..."
                className="w-full border rounded-lg p-3 mt-2 bg-gray-50 text-sm focus:ring focus:ring-[#6B1E1E]/20"
                rows={3}
              ></textarea>
            </div>

            {/* Upload Box */}
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">Upload File *</label>
              <div className="mt-3 border border-dashed rounded-xl min-h-[140px] flex flex-col justify-center items-center text-gray-500 bg-gray-50">
                <span className="text-4xl">📎</span>
                <p className="text-sm">Drag & Drop file atau klik tombol di bawah</p>
                <button className="border px-4 py-1 mt-4 rounded-lg text-sm hover:bg-gray-100">
                  Browse File
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="text-right mt-6">
              <button className="bg-[#6B1E1E] text-white px-6 py-2 rounded-lg hover:bg-[#531414] transition">
                Upload Dokumen
              </button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white shadow-sm p-6 border mt-10 rounded-xl">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Daftar Dokumen</h2>

              {/* Filter */}
              <div className="flex gap-3">
                <select className="border px-3 py-2 rounded-lg text-sm bg-gray-50">
                  <option>Semua Jenis</option>
                </select>

                <input
                  placeholder="Cari dokumen..."
                  className="border px-4 py-2 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Jenis Dokumen</th>
                  <th className="text-left p-3">Nama File</th>
                  <th className="text-left p-3">Tanggal Upload</th>
                  <th className="text-left p-3">Catatan</th>
                  <th className="text-center p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {dokumen.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-300">
                        {item.jenis}
                      </span>
                    </td>
                    <td className="p-3">{item.file}</td>
                    <td className="p-3">{item.tanggal}</td>
                    <td className="p-3">{item.catatan}</td>
                    <td className="text-center p-3 flex gap-2 justify-center">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-xs flex items-center gap-1">👁 Lihat</button>
                      <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 rounded-full text-xs flex items-center gap-1">🖨 Cetak</button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-xs flex items-center gap-1">🗑 Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-3 text-sm text-gray-600">
              <p>Menampilkan 1-3 dari 7 dokumen</p>
              <div className="flex gap-2">
                <button className="border px-3 py-1 rounded">Previous</button>
                <button className="bg-[#6B1E1E] text-white px-3 py-1 rounded">1</button>
                <button className="border px-3 py-1 rounded">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
