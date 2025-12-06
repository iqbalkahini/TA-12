import Image from "next/image";
import React from "react";

const DaftarIndustri = () => {
  const industries = [
    { id: 1, name: "JV Partner Indonesia", total: "6 Anak" },
    { id: 2, name: "JV Partner Indonesia", total: "6 Anak" },
    { id: 3, name: "JV Partner Indonesia", total: "6 Anak" },
    { id: 4, name: "JV Partner Indonesia", total: "6 Anak" },
    { id: 5, name: "JV Partner Indonesia", total: "6 Anak" },
  ];

  return (
    <div className="min-h-screen bg-white flex">

      {/* Main Content */}
      <main className="flex-1 bg-white p-8">
        <div className="border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Industri</h2>

          {/* List Industri */}
          <div className="space-y-4">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={'/logo/logo_header.png'}
                    alt={'p'}
                    width={80}
                    height={80}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{ind.name}</p>
                    <p className="text-sm text-gray-500">{ind.total}</p>
                  </div>
                </div>
                <button className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full hover:bg-blue-200 transition">
                  Lihat
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 border rounded-lg px-4 py-2 text-sm">
          <p>Menampilkan 1–3 dari 7 Permohonan</p>
          <div className="flex items-center gap-1">
            <button className="border rounded-full px-2 py-1">&lt;</button>
            <button className="bg-[#6B0F0F] text-white rounded-full px-2 py-1">01</button>
            <button className="border rounded-full px-2 py-1">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarIndustri;