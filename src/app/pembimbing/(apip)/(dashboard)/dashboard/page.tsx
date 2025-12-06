import React from "react";

export default function DashboardMagangHub() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="flex">
        <div className="flex-1 p-8">
          {/* METRICS CARDS */}
          <section className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <div className="text-sm text-gray-500">Siswa Aktif PKL</div>
                <div className="text-4xl font-extrabold mt-2">156</div>
                <div className="text-sm text-green-500 mt-2">↑ +12% dari bulan lalu</div>
              </div>
              <div className="w-16 h-16 rounded-lg bg-[#dff4ff] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#2b7bd3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <div className="text-sm text-gray-500">Industri Partner</div>
                <div className="text-4xl font-extrabold mt-2">26</div>
                <div className="text-sm text-blue-500 mt-2">Aktif bekerjasama</div>
              </div>
              <div className="w-16 h-16 rounded-lg bg-[#f6eaea] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#7b3b3b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS BOX */}
          <section className="mt-10">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Notifikasi</h2>
                <a href="#" className="text-sm text-gray-500">Lihat Semua</a>
              </div>

              <ul className="space-y-6">
                {sampleNotifications.map((n, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                        <img src={n.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{n.name}</div>
                        <div className="text-sm text-gray-500">{n.classAndCompany} <span className="text-red-600">| Mengadukan Masalah</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor(n.status)}`}>{n.status}</div>
                      <button className="px-4 py-2 rounded-full bg-[#dff2ff] text-[#1a73e8] font-medium shadow-sm">Periksa</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* helper spacing for wide screens */}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}


// ---------- Helper data & functions ----------
const sampleNotifications = [
  {
    name: "Park Jhokuwie",
    classAndCompany: "XII RPL 1 • PT. Teknologi Maju",
    status: "Menunggu",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    name: "Kim Shareonni",
    classAndCompany: "XII TKJ 2 • CV. Solusi Digital",
    status: "Disetujui",
    avatar: "https://i.pravatar.cc/80?img=33",
  },
  {
    name: "Lee Bhouwo",
    classAndCompany: "XII MM 1 • Bank Mandiri",
    status: "Ditolak",
    avatar: "https://i.pravatar.cc/80?img=56",
  },
];

function statusColor(status: string) {
  switch (status) {
    case "Menunggu":
      return "bg-amber-100 text-amber-700";
    case "Disetujui":
      return "bg-green-100 text-green-700";
    case "Ditolak":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
