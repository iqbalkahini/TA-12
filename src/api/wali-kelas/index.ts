import { ApiResponsePermasalahan, Item } from "@/types/permasalahan";
import axiosInstance from "@/utils/axios";

export interface WaliKelasDashboardDto {
  kelas_info: {
    id: number;
    nama: string;
    jurusan: string;
    wali_kelas: string;
    total_siswa: number;
  };
  pagination: {
    limit: number;
    page: number;
    total_items: number;
    total_pages: number;
  };
  siswa_list: SiswaPklSummaryDto[];
}

export interface SiswaPklSummaryDto {
  id: number;
  nisn: string;
  nama: string;
  status_pkl: string;
  industri: string | null;
  pembimbing: string | null; // Guru Pembimbing
  pembimbing_industri: string | null;
  alamat_industri: string | null;
  no_telp_industri: string | null;
  no_telp_pembimbing_sekolah: string | null;
}

export const getWaliKelasDashboard = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status_pkl: string = "",
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status_pkl) params.append("status_pkl", status_pkl);

    const response = await axiosInstance.get("/api/guru/dashboard/wali-kelas", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get Wali Kelas dashboard failed:", error);
    return null;
  }
};

export async function getIzinByWaliKelas() {
  try {
    const res = await axiosInstance.get('/api/izin/wali-kelas')
    return res.data
  } catch (error) {
    throw error
  }
}

// permasalahan
export async function getPermasalahanByWaliKelas(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "opened" | "in_progress" | "resolved";
}) {
  try {
    const res = await axiosInstance.get('/api/student-issues/wali-kelas', {
      params,
    })
    return res.data as ApiResponsePermasalahan
  } catch (error) {
    throw error
  }
}

export async function getPermasalahanByIdWaliKelas(id: number, params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "opened" | "in_progress" | "resolved";
}) {
  try {
    const res = await axiosInstance.get(`/api/student-issues/${id}`)
    return res.data as Item
  } catch (error) {
    throw error
  }
}

export async function patchPermasalahanByWaliKelas(id: number, data: { status: string, tindak_lanjut?: string }) {
  try {
    const response = await axiosInstance.patch(`/api/student-issues/${id}`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}

// export nilai siswa
export async function getNilaiSiswaByWaliKelas() {
  try {
    const res = await axiosInstance.get('/api/penilaian/wali/export', {
      responseType: 'blob',
    })
    return res.data
  } catch (error) {
    throw error
  }
}