import React from "react";

export default function DetailIndustri() {
  const peserta = [
    { nama: "Park Jhokuwie", kelas: "XII RPL 1", foto: "/profile1.jpg" },
    { nama: "Kim Shareonni", kelas: "XII TKJ 2", foto: "/profile2.jpg" },
    { nama: "Lee Bhouwo", kelas: "XII MM 1", foto: "/profile3.jpg" },
    { nama: "Lee Bhouwo", kelas: "XII MM 1", foto: "/profile3.jpg" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#6b1e1e] text-white flex flex-col justify-between">
        <div>
          <div className="p-5 flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-8" />
            <div>
              <h2 className="font-bold text-lg">Dashboard PKL</h2>
              <p className="text-sm opacity-80">Koordinator</p>
            </div>
          </div>

          <nav className="mt-3 space-y-2">
            {["Dashboard", "Bukti", "Permasalahan", "Perizinan", "Persetujuan Pindah"].map((item) => (
              <button key={item} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#5b1717]">
                <span>📌</span> {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-[#5b1717] p-4 flex items-center gap-3">
          <img src="/profile.jpg" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm">Pak Ilham</p>
            <p className="text-xs opacity-60">Koordinator</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1">
        
        {/* Header */}
        <header className="border-b flex justify-between px-5 py-4 bg-white">
          <div className="flex items-center gap-3">
            <img src="/maganghub.svg" className="h-8" />
            <p className="text-gray-500 text-sm">Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
          </div>

          <div className="flex items-center gap-5">
            <span className="relative cursor-pointer">
              🔔
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                3
              </span>
            </span>
            <span className="cursor-pointer">⚙️</span>
          </div>
        </header>

        {/* Card */}
        <div className="m-6 bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-5">Detail Industri</h2>
          
          {/* Form Section */}
          <div className="grid grid-cols-3 gap-10">
            <img 
              src="/industry.jpg"
              className="rounded-lg w-[260px] h-[200px] object-cover"
            />

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-sm">Industri *</label>
                <input className="w-full border rounded-lg p-2" defaultValue="JV Partner Indonesia" />
              </div>
              <div>
                <label className="font-semibold text-sm">Alamat *</label>
                <input className="w-full border rounded-lg p-2" defaultValue="Jl. Danau Toba, No.14" />
              </div>
              <div>
                <label className="font-semibold text-sm">Bidang *</label>
                <input className="w-full border rounded-lg p-2" defaultValue="Design" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-sm">Kontak *</label>
                <input className="w-full border rounded-lg p-2" defaultValue="Pak Toni - +62812 0000 0000" />
              </div>

              <div>
                <label className="font-semibold text-sm">Tanggal Mulai *</label>
                <input type="date" className="w-full border rounded-lg p-2" defaultValue="2025-09-01" />
              </div>

              <div>
                <label className="font-semibold text-sm">Tanggal Akhir *</label>
                <input type="date" className="w-full border rounded-lg p-2" defaultValue="2025-12-31" />
              </div>
            </div>
          </div>

          {/* Peserta */}
          <div className="mt-10">
            <h3 className="font-semibold text-md mb-5 flex items-center gap-2">
              🔻 Daftar Peserta PKL
            </h3>

            {peserta.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center gap-3">
                  <img src={p.foto} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{p.nama}</p>
                    <p className="text-sm text-gray-500">{p.kelas}</p>
                  </div>
                </div>

                <button className="bg-[#cfe8ff] text-blue-600 px-4 rounded-lg hover:bg-blue-100">
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
