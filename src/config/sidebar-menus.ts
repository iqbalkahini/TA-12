import {
  Home,
  FileUp,
  TriangleAlert,
  CalendarCheck,
  Inbox,
  Users,
  Building2,
  Calendar,
  FileCheck,
  MapPin,
  type LucideIcon,
  Upload,
  Bell,
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
    name: "Beranda",
    url: "/pembimbing/beranda",
    icon: Home,
    pathName: ["beranda", "data-industri", "data-siswa", "detail-siswa"],
  },
  {
    name: "Jadwal & Unggah Bukti",
    url: "/pembimbing/jadwal/bukti",
    icon: Calendar,
    pathName: ["jadwal", "bukti"],
  },
  {
    name: "Bukti Kegiatan",
    url: "/pembimbing/bukti-kegiatan",
    icon: FileUp,
    pathName: ["bukti-kegiatan"],
  },
  {
    name: "Penilaian",
    url: "/pembimbing/penilaian",
    icon: FileUp,
    pathName: ["penilaian"],
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
    name: "Persetujuan Pindah PKL",
    url: "/pembimbing/persetujuan-pindah",
    icon: Inbox,
    pathName: ["persetujuan-pindah"],
  },
];

// Menu untuk Koordinator (Pokja)
export const koordinatorMenus: SidebarMenuItem[] = [
  {
    name: "Beranda",
    url: "/koordinator/beranda",
    icon: Home,
    pathName: ["beranda"],
  },
  {
    name: "Jadwal",
    url: "/koordinator/jadwal",
    icon: Calendar,
    pathName: ["jadwal"],
  },
  {
    name: "Persetujuan PKL",
    url: "/koordinator/persetujuan-pkl",
    icon: FileCheck,
    pathName: ["persetujuan-pkl"],
  },
  {
    name: "Pengajuan PKL",
    url: "/koordinator/pengajuan-pkl",
    icon: FileUp,
    pathName: ["pengajuan-pkl"],
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
    name: "Pembimbing",
    url: "/koordinator/pembimbing",
    icon: Users,
    pathName: ["pembimbing"],
  },
  {
    name: "Persetujuan Pindah PKL",
    url: "/koordinator/pindah-pkl",
    icon: Inbox,
    pathName: ["pindah-pkl"],
  },
];

// Menu untuk Wali Kelas
export const waliKelasMenus: SidebarMenuItem[] = [
  {
    name: "Beranda",
    url: "/wali-kelas/beranda",
    icon: Home,
    pathName: ["beranda"],
  },
  {
    name: "Permasalahan Siswa",
    url: "/wali-kelas/permasalahan-siswa",
    icon: TriangleAlert,
    pathName: ["permasalahan-siswa"],
  },
  {
    name: "Monitor Perizinan",
    url: "/wali-kelas/monitor-perizinan",
    icon: CalendarCheck,
    pathName: ["monitor-perizinan"],
  },
];

// Menu untuk Kapro (Konsentrasi Keahlian)
export const kaproMenus: SidebarMenuItem[] = [
  {
    name: "Beranda",
    url: "/kapro/beranda",
    icon: Home,
    pathName: ["beranda"],
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
  // {
  //   name: "Bukti Diterima",
  //   url: "/kapro/bukti-diterima",
  //   icon: FileUp,
  //   pathName: ["bukti-diterima"],
  // },
  {
    name: "Pembimbing PKL",
    url: "/kapro/pembimbing-pkl",
    icon: Users,
    pathName: ["pembimbing-pkl"],
  },
  // {
  //   name: "Perizinan",
  //   url: "/kapro/perizinan",
  //   icon: CalendarCheck,
  //   pathName: ["perizinan"],
  // },
  {
    name: "Persetujuan Pindah PKL",
    url: "/kapro/pindah-pkl",
    icon: Inbox,
    pathName: ["pindah-pkl"],
  },
];

// Menu untuk Siswa
export const siswaMenus: SidebarMenuItem[] = [
  {
    name: "Beranda",
    url: "/siswa/beranda",
    icon: Home,
    pathName: ["beranda"],
  },
  {
    name: "Pengajuan PKL",
    url: "/siswa/pengajuan-pkl",
    icon: FileUp,
    pathName: ["pengajuan-pkl"],
  },
  {
    name: "Kelompok",
    url: "/siswa/kelompok",
    icon: Users,
    pathName: ["kelompok"],
  },
  {
    name: "Unggah Dokumen",
    url: "/siswa/unggah-dokumen",
    icon: Upload,
    pathName: ["unggah-dokumen"],
  },
  {
    name: "Pengajuan Pindah PKL",
    url: "/siswa/pindah-pkl",
    icon: Inbox,
    pathName: ["pindah-pkl"],
  },
  {
    name: "Perizinan",
    url: "/siswa/perizinan",
    icon: CalendarCheck,
    pathName: ["perizinan"],
  },
  // {
  //   name: "Notifikasi Siswa",
  //   url: "/siswa/notifikasi",
  //   icon: Bell,
  //   pathName: ["notifikasi"],
  // },
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
