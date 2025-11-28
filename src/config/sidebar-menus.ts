import {
  Home,
  FileUp,
  TriangleAlert,
  CalendarCheck,
  Inbox,
  Users,
  Building2,
  BookOpen,
  ClipboardList,
  Calendar,
  FileCheck,
  Printer,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export interface SidebarMenuItem {
  name: string;
  url: string;
  icon: LucideIcon;
  pathName: string[];
}

export interface SidebarConfig {
  role: string;
  menus: SidebarMenuItem[];
}

// Menu untuk Pembimbing
export const pembimbingMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/pembimbing/dashboard",
    icon: Home,
    pathName: ["dashboard", "data-industri", "data-siswa", "detail-siswa"],
  },
  {
    name: "Bukti",
    url: "/pembimbing/bukti",
    icon: FileUp,
    pathName: ["bukti"],
  },
  {
    name: "Permasalahan",
    url: "/pembimbing/permasalahan",
    icon: TriangleAlert,
    pathName: ["permasalahan"],
  },
  {
    name: "Perizinan",
    url: "/pembimbing/perizinan",
    icon: CalendarCheck,
    pathName: ["perizinan"],
  },
  {
    name: "Persetujuan Pindah",
    url: "/pembimbing/persetujuan-pindah",
    icon: Inbox,
    pathName: ["persetujuan-pindah"],
  },
];

// Menu untuk Koordinator
export const koordinatorMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/koordinator/dashboard",
    icon: Home,
    pathName: ["dashboard"],
  },
  {
    name: "Jadwal",
    url: "/koordinator/jadwal",
    icon: Calendar,
    pathName: ["jadwal"],
  },
  {
    name: "Permohonan PKL",
    url: "/koordinator/permohonan-pkl",
    icon: FileCheck,
    pathName: ["permohonan-pkl"],
  },
  {
    name: "Industri",
    url: "/koordinator/industri",
    icon: Building2,
    pathName: ["industri"],
  },
  {
    name: "Peserta",
    url: "/koordinator/peserta",
    icon: Users,
    pathName: ["peserta"],
  },
  {
    name: "Cetak Surat",
    url: "/koordinator/cetak-surat",
    icon: Printer,
    pathName: ["cetak-surat"],
  },
  {
    name: "Pembimbing",
    url: "/koordinator/pembimbing",
    icon: Users,
    pathName: ["pembimbing"],
  },
];

// Menu untuk Wali Kelas
export const waliKelasMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/wali-kelas/dashboard",
    icon: Home,
    pathName: ["dashboard"],
  },
  {
    name: "Permasalahan Siswa",
    url: "/wali-kelas/permasalahan-siswa",
    icon: TriangleAlert,
    pathName: ["permasalahan-siswa"],
  },
];

// Menu untuk Kapro (Kepala Program)
export const kaproMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/kapro/dashboard",
    icon: Home,
    pathName: ["dashboard"],
  },
  {
    name: "Tempat Magang",
    url: "/kapro/tempat-magang",
    icon: MapPin,
    pathName: ["tempat-magang"],
  },
  {
    name: "Pengajuan PKL",
    url: "/kapro/pengajuan-pkl",
    icon: FileCheck,
    pathName: ["pengajuan-pkl"],
  },
  {
    name: "Bukti Diterima",
    url: "/kapro/bukti-diterima",
    icon: FileUp,
    pathName: ["bukti-diterima"],
  },
  {
    name: "Pembimbing PKL",
    url: "/kapro/pembimbing-pkl",
    icon: Users,
    pathName: ["pembimbing-pkl"],
  },
  {
    name: "Perizinan",
    url: "/kapro/perizinan",
    icon: CalendarCheck,
    pathName: ["perizinan"],
  },
  {
    name: "Pindah PKL",
    url: "/kapro/pindah-pkl",
    icon: Inbox,
    pathName: ["pindah-pkl"],
  },
];

// Menu untuk Siswa
export const siswaMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/siswa/dashboard",
    icon: Home,
    pathName: ["dashboard"],
  },
  {
    name: "Pengajuan PKL",
    url: "/siswa/pengajuan-pkl",
    icon: FileUp,
    pathName: ["bukti"],
  },
  {
    name: "Laporan Masalah",
    url: "/siswa/permasalahan",
    icon: TriangleAlert,
    pathName: ["permasalahan"],
  },
  {
    name: "Pengajuan Izin",
    url: "/siswa/perizinan",
    icon: CalendarCheck,
    pathName: ["perizinan"],
  },
  {
    name: "Pengajuan Pindah",
    url: "/siswa/pindah",
    icon: Inbox,
    pathName: ["pindah"],
  },
];

// Fungsi helper untuk mendapatkan menu berdasarkan role
export const getMenusByRole = (
  role: string,
  guruData?: {
    is_koordinator?: boolean;
    is_pembimbing?: boolean;
    is_wali_kelas?: boolean;
    is_kaprog?: boolean;
  }
): SidebarMenuItem[] => {
  // Untuk guru, cek role spesifiknya
  if (role === "gru" && guruData) {
    if (guruData.is_kaprog) return kaproMenus;
    if (guruData.is_koordinator) return koordinatorMenus;
    if (guruData.is_wali_kelas) return waliKelasMenus;
    if (guruData.is_pembimbing) return pembimbingMenus;
  }

  // Role spesifik
  switch (role) {
    case "pembimbing":
      return pembimbingMenus;
    case "koordinator":
      return koordinatorMenus;
    case "wali-kelas":
      return waliKelasMenus;
    case "kapro":
      return kaproMenus;
    case "ssw":
    case "siswa":
      return siswaMenus;
    default:
      return pembimbingMenus; // Default fallback
  }
};

// Fungsi untuk mendapatkan base path berdasarkan role
export const getBasePathByRole = (
  role: string,
  guruData?: {
    is_koordinator?: boolean;
    is_pembimbing?: boolean;
    is_wali_kelas?: boolean;
    is_kaprog?: boolean;
  }
): string => {
  if (role === "gru" && guruData) {
    if (guruData.is_kaprog) return "/kapro";
    if (guruData.is_koordinator) return "/koordinator";
    if (guruData.is_wali_kelas) return "/wali-kelas";
    if (guruData.is_pembimbing) return "/pembimbing";
  }

  switch (role) {
    case "adm":
      return "/admin";
    case "ssw":
      return "/siswa";
    default:
      return "/pembimbing";
  }
};
