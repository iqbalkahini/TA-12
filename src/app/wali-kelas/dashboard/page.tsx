import { GraduationCap, Users, Building2, ArrowUp, Search, MoreHorizontal } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">

            {/* CONTENT */}
            <main className="p-8">
                {/* CARDS */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card
                        title="Siswa Aktif PKL"
                        value="156"
                        info={
                            <span className="text-green-600 text-sm flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" /> +12% dari bulan lalu
                            </span>
                        }
                        icon={GraduationCap}
                        iconStyle="bg-blue-100 text-blue-600"
                    />

                    <Card
                        title="Pembimbing PKL"
                        value="38"
                        info={<span className="text-orange-500 text-sm">Penghubung sekolah & industri</span>}
                        icon={Users}
                        iconStyle="bg-orange-100 text-orange-500"
                    />

                    <Card
                        title="Industri Partner"
                        value="26"
                        info={<span className="text-blue-600 text-sm">Aktif bekerjasama</span>}
                        icon={Building2}
                        iconStyle="bg-gray-200 text-gray-600"
                    />
                </section>

                {/* TABLE */}
                <section className="bg-white mt-8 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold">Data Siswa</h3>

                    <div className="relative my-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama siswa atau industri..."
                            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                    </div>

                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Nama Siswa</th>
                                <th className="p-3">Nama Industri</th>
                                <th className="p-3">Sakit</th>
                                <th className="p-3">Izin</th>
                                <th className="p-3">Alpha</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-b text-center">
                                    <td className="p-3 text-left">{row.nama}</td>
                                    <td className="p-3">{row.industri}</td>
                                    <td className="p-3">{row.sakit}</td>
                                    <td className="p-3">{row.izin}</td>
                                    <td className="p-3">{row.alpha}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center">
                                            <MoreHorizontal className="cursor-pointer text-gray-400 hover:text-gray-600 w-5 h-5" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-between mt-4 text-sm">
                        <span>Menampilkan 1–3 dari 7 laman guru pembimbing.</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded">&lt;</button>
                            <button className="px-3 py-1 bg-red-800 text-white rounded">01</button>
                            <button className="px-3 py-1 border rounded">&gt;</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function Card({ title, value, info, icon: Icon, iconStyle }: any) {
    return (
        <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-sm">
            <div>
                <p className="text-gray-600">{title}</p>
                <h1 className="text-3xl font-bold my-2">{value}</h1>
                {info}
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconStyle}`}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    );
}

const data = [
    { nama: "Ahmad Fauzi Rahman", industri: "PT Telkom Indonesia", sakit: 2, izin: 1, alpha: 0 },
    { nama: "Sari Indah Permata", industri: "Bank BCA", sakit: 1, izin: 3, alpha: 1 },
    { nama: "Budi Santoso Wijaya", industri: "Garuda Indonesia", sakit: 0, izin: 2, alpha: 0 },
    { nama: "Dewi Kusuma Sari", industri: "PLN Persero", sakit: 3, izin: 0, alpha: 2 },
    { nama: "Rizki Pratama Jaya", industri: "Pertamina", sakit: 1, izin: 1, alpha: 0 },
];