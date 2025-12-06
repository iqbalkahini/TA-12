import React from "react";

export default function ManajemenSiswaDashboard() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="flex">

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8">

          {/* Title Section */}
          <section>
            <h2 className="text-2xl font-bold">Manajemen Siswa</h2>
            <p className="text-sm text-gray-500">Kelola data siswa dan informasi pribadi</p>
          </section>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Cari Berdasarkan nama, kelas, atau NISN..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#6b1717] focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto border border-gray-100 rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">NISN</th>
                  <th className="py-3 px-4 font-semibold">Nama Lengkap</th>
                  <th className="py-3 px-4 font-semibold">Kelas</th>
                  <th className="py-3 px-4 font-semibold">No. Telp</th>
                  <th className="py-3 px-4 font-semibold">Tanggal Lahir</th>
                  <th className="py-3 px-4 font-semibold">Alamat</th>
                  <th className="py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{s.nisn}</td>
                    <td className="py-3 px-4">{s.name}</td>
                    <td className="py-3 px-4">{s.class}</td>
                    <td className="py-3 px-4">{s.phone}</td>
                    <td className="py-3 px-4">{s.birth}</td>
                    <td className="py-3 px-4 truncate max-w-[200px]">{s.address}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
            <p>Menampilkan 1–3 dari 7 Permohonan</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 border rounded-lg bg-[#6b1717] text-white">1</button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Navigation and sample data
// const navItems = [
//   { label: "Dashboard", icon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v9H3z"/></svg> },
//   { label: "Bukti", icon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg> },
//   { label: "Permasalahan", icon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M5 19h14l-7-14z"/></svg> },
//   { label: "Perizinan", icon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/></svg> },
//   { label: "Persetujuan Pindah", icon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> },
// ];

const students = [
  { nisn: "0897654583", name: "Ahmad Sahroni", class: "XII AV 2", phone: "081237262918", birth: "3 Okt 2025", address: "Jl. Saxophone No.69 Lowokwaru..." },
  { nisn: "1234567888", name: "Agil Rifatul Haq", class: "XII DKV 3", phone: "085723971833", birth: "15 Agu 2005", address: "Jl. Melati No. 24, Kel. Sukamaju..." },
  { nisn: "1234567890", name: "Bintang Firman Ardana", class: "XII TKJ 3", phone: "085737618319", birth: "27 Jan 2007", address: "Jl. Mawar Indah No. 7, Kel. Rungkut..." },
  { nisn: "1234569890", name: "Diandhika Dwi Pratama", class: "XII RPL 1", phone: "081243324813", birth: "28 Jan 2005", address: "Jl. Anggrek V No. 10, Kel. Cibubur..." },
  { nisn: "7832470938", name: "Fidatul Aviva", class: "XII BC 2", phone: "081242813804", birth: "17 Sep 2025", address: "Jl. Melati No. 24, Kel. Sukamaju..." },
];
