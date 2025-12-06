import React from "react";
import { Home, FileText, AlertCircle, Calendar, FileCheck, Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DetailSiswaPKL() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1">
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
                <Avatar className="w-40 h-40">
                  <AvatarFallback >
                    cn
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
