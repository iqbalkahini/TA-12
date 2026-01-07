import React from "react";

export default function Dashboard() {
  const notifications = [
    {
      id: 1,
      name: "Park Jhokuwie",
      class: "XII RPL 1",
      company: "PT. Teknologi Maju",
      issue: "Mengadukan Masalah",
      status: "waiting",
      avatarLetter: "P",
    },
    {
      id: 2,
      name: "Kim Shareonni",
      class: "XII TKJ 2",
      company: "CV. Solusi Digital",
      issue: "Mengadukan Masalah",
      status: "approved",
      avatarLetter: "K",
    },
    {
      id: 3,
      name: "Lee Bhouwo",
      class: "XII MM 1",
      company: "Bank Mandiri",
      issue: "Mengadukan Masalah",
      status: "rejected",
      avatarLetter: "L",
    },
  ];
  const students = [
    { nisn: "0897654583", name: "Ahmad Sahroni", class: "XII AV 2", phone: "081237262918", birth: "3 Okt 2025", address: "Jl. Saxophone No.69 Lowokwaru..." },
    { nisn: "1234567888", name: "Agil Rifatul Haq", class: "XII DKV 3", phone: "085723971833", birth: "15 Agu 2005", address: "Jl. Melati No. 24, Kel. Sukamaju..." },
    { nisn: "1234567890", name: "Bintang Firman Ardana", class: "XII TKJ 3", phone: "085737618319", birth: "27 Jan 2007", address: "Jl. Mawar Indah No. 7, Kel. Rungkut..." },
    { nisn: "1234569890", name: "Diandhika Dwi Pratama", class: "XII RPL 1", phone: "081243324813", birth: "28 Jan 2005", address: "Jl. Anggrek V No. 10, Kel. Cibubur..." },
    { nisn: "7832470938", name: "Fidatul Aviva", class: "XII BC 2", phone: "081242813804", birth: "17 Sep 2025", address: "Jl. Melati No. 24, Kel. Sukamaju..." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased">
      <div className="flex">

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8">
          {/* Top header */}
          <header className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-[#6e1f21]">MagangHub</h1>
              <p className="text-sm text-gray-500">Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
                <span className="absolute -top-0 -right-0 bg-[#c1272d] text-white text-xs font-semibold rounded-full px-1.5 py-0.5">3</span>
              </div>
            </div>
          </header>

          {/* Cards */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Siswa Aktif PKL</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">156</h2>
                <p className="text-sm text-green-500 mt-3">↑ +12% dari bulan lalu</p>
              </div>
              <div className="w-16 h-16 bg-[#dcefff] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#1b63d6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8a2 2 0 002-2v-2a4 4 0 00-4-4H10a4 4 0 00-4 4v2a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Industri Partner</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">26</h2>
                <p className="text-sm text-blue-600 mt-3">Aktif bekerjasama</p>
              </div>
              <div className="w-16 h-16 bg-[#f3e6e6] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#8b3032]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7zM7 7h10v4H7z" />
                </svg>
              </div>
            </div>
          </section>
          <div className="min-h-screen bg-white text-gray-800 font-sans">
            <div className="flex">

              {/* MAIN CONTENT */}
              <main className="flex-1 p-8">

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
        </main>
      </div>
    </div>
  );
}
