import { GraduationCap, CheckCircle, Hourglass, Building } from "lucide-react";

export default function DashboardPKL() {
    return (
        <div className="min-h-screen bg-gray-100 font-inter p-6 text-gray-900">
            <h1 className="text-xl font-semibold mb-6">Beranda</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Siswa Aktif PKL"
                    value="156"
                    note="+12% dari bulan lalu"
                    noteColor="text-green-600"
                    icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
                    iconBg="bg-blue-100"
                />
                <StatCard
                    title="PKL Disetujui"
                    value="251"
                    note="+8% dari bulan lalu"
                    noteColor="text-green-600"
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    iconBg="bg-green-100"
                />
                <StatCard
                    title="Permohonan Tertunda"
                    value="38"
                    note="Perlu ditinjau"
                    noteColor="text-orange-600"
                    icon={<Hourglass className="w-6 h-6 text-orange-600" />}
                    iconBg="bg-orange-100"
                />
                <StatCard
                    title="Rekan Industri"
                    value="26"
                    note="Aktif bekerjasama"
                    noteColor="text-purple-600"
                    icon={<Building className="w-6 h-6 text-purple-600" />}
                    iconBg="bg-purple-100"
                />
            </div>

            {/* Panel */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-semibold">Permohonan Terbaru</h2>
                        <p className="text-sm text-gray-500">Daftar pengajuan PKL siswa yang perlu ditinjau</p>
                    </div>
                    <button className="text-sm font-medium">Lihat Semua</button>
                </div>

                <RequestItem name="Park Jhokuwie" info="XII RPL 1 • PT. Teknologi Maju" status="Menunggu" />
                <RequestItem name="Kim Shareonni" info="XII TKJ 2 • CV. Solusi Digital" status="Selesai" />
                <RequestItem name="Lee Bhouwo" info="XII MM 1 • Bank Mandiri" status="Tolak" />
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    note: string;
    noteColor: string;
    icon: React.ReactNode;
    iconBg: string;
}

function StatCard({ title, value, note, noteColor, icon, iconBg }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                <p className={`text-xs mt-1 ${noteColor}`}>{note}</p>
            </div>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
                {icon}
            </div>
        </div>
    );
}

interface RequestItemProps {
    name: string;
    info: string;
    status: "Menunggu" | "Selesai" | "Tolak";
}

function RequestItem({ name, info, status }: RequestItemProps) {
    const statusStyle =
        status === "Menunggu"
            ? "bg-orange-100 text-orange-600"
            : status === "Selesai"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600";

    return (
        <div className="flex justify-between items-center py-3 border-b last:border-b-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{info}</p>
                </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle}`}>{status}</span>
        </div>
    );
}
