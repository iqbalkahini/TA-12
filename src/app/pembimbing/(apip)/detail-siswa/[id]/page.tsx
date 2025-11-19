import React from "react";
import { Home, FileText, AlertCircle, Calendar, FileCheck, Bell, Settings } from 'lucide-react';

export default function DetailSiswaPKL() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#651B1B] text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#7A2A2A]">
            <div>
              <h1 className="text-lg font-semibold">Dashboard PKL</h1>
              <p className="text-sm text-gray-300">Koordinator</p>
            </div>
            <button className="text-sm text-gray-300">Tutup</button>
          </div>

          <nav className="mt-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-6 py-3 bg-[#7A2A2A] rounded-r-full">
              <Home size={18} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-[#7A2A2A] rounded-r-full">
              <FileText size={18} /> Bukti
            </a>
            <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-[#7A2A2A] rounded-r-full">
              <AlertCircle size={18} /> Permasalahan
            </a>
            <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-[#7A2A2A] rounded-r-full">
              <Calendar size={18} /> Perizinan
            </a>
            <a href="#" className="flex items-center gap-3 px-6 py-3 hover:bg-[#7A2A2A] rounded-r-full">
              <FileCheck size={18} /> Persetujuan Pindah
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3 bg-[#7A2A2A] p-4">
          <img src="/profile.jpg" alt="Pak Ilham" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium">Pak Ilham</p>
            <p className="text-xs text-gray-300">Koordinator</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b bg-white">
          <div className="flex items-center">
            <img src="/logo-maganghub.png" alt="MagangHub" className="h-8 mr-2" />
            <div>
              <h2 className="font-bold text-xl text-[#651B1B]">MagangHub</h2>
              <p className="text-sm text-gray-500">Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </div>
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
        </header>

        {/* Detail Siswa */}
        <section className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border max-w-5xl mx-auto">
            <h3 className="text-2xl font-semibold mb-8">Data Peserta didik PKL</h3>

            <div className="flex items-start justify-between">
              {/* Data Kiri */}
              <div className="flex-1 space-y-6">
                {/* Nama */}
                <div>
                  <label className="text-sm text-gray-600">Nama</label>
                  <input type="text" value="Dhia Mirza Handhiono" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                </div>

                {/* NISN dan No Telp */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">NISN</label>
                    <input type="text" value="74827932984132" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">No. Telp</label>
                    <input type="text" value="+62812 0000 0000" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                  </div>
                </div>

                {/* Kelas dan Jurusan */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Kelas</label>
                    <input type="text" value="XII RPL 1" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Jurusan</label>
                    <input type="text" value="Rekayasa Perangkat Lunak" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                  </div>
                </div>

                {/* Alamat */}
                <div>
                  <label className="text-sm text-gray-600">Alamat</label>
                  <input type="text" value="Jl. Terkam Harimau, No. 12, RT.04, RW.05" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                </div>

                {/* Industri */}
                <div>
                  <label className="text-sm text-gray-600">Industri</label>
                  <input type="text" value="PT. Seercerah Harapan" className="w-full rounded-full border px-4 py-2 mt-1 focus:outline-none" readOnly />
                </div>
              </div>

              {/* Foto */}
              <div className="ml-12">
                <img src="/profile-student.jpg" alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gray-200" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
