import { jadwalPkl } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function getActiveTahunAjaran() {
  try {
    const response = await axiosInstance.get("/api/tahun-ajaran/active");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createJadwal(data: jadwalPkl) {
  try {
    const response = await axiosInstance.post("/api/kegiatan-pkl", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getJadwalByTahunAjaran(tahun_ajaran_id: number) {
  try {
    const response = await axiosInstance.get(
      `/api/kegiatan-pkl/tahun-ajaran/${tahun_ajaran_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateJadwal(id: number, data: jadwalPkl) {
  try {
    const response = await axiosInstance.put(`/api/kegiatan-pkl/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteJadwal(id: number) {
  try {
    const response = await axiosInstance.delete(`/api/kegiatan-pkl/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function listPindahPklKoordinator() {
  try {
    const response = await axiosInstance.get(`/api/pindah-pkl/koordinator`);
    return response.data;
  } catch (error) {
    throw error
  }
}
export async function patchPindahPklKoordinator(id: number, data:
  {
    catatan: string,
    status: "approved" | "rejected",
    tanggal_efektif: string
  }
) {
  try {
    const response = await axiosInstance.patch(`/api/pindah-pkl/${id}/koordinator`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}


export interface PklPengajuanTerbaru {
  application_id: number;
  status: string;
  tanggal_permohonan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  siswa_id: number;
  siswa_username: string;
  siswa_nisn: string;
  kelas_id: number;
  kelas_nama: string;
  jurusan_id: number;
  jurusan_nama: string;
  industri_id: number;
  industri_nama: string;
}

export interface ListApprovePklKoordinatorResponse {
  data: PklPengajuanTerbaru[];
  total: number;
}

export async function listApprovePklKoordinator(page: number, kelas_id?: number, jurusan_id?: number, industri_id?: number, search?: string): Promise<ListApprovePklKoordinatorResponse> {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", "10");
    if (kelas_id) params.append("kelas_id", kelas_id.toString());
    if (jurusan_id) params.append("jurusan_id", jurusan_id.toString());
    if (industri_id) params.append("industri_id", industri_id.toString());
    if (search) params.append("search", search.toString());

    const response = await axiosInstance.get(`/api/pkl/koordinator/approved`, { params });
    return response.data;
  } catch (error) {
    throw error
  }
}

// izin
export async function getDetailSIA(siswa_id: number): Promise<{ izin: number, sakit: number, siswa_id: number }> {
  try {
    const response = await axiosInstance.get(`/api/izin/students/${siswa_id}/summary`);
    return response.data;
  } catch (error) {
    throw error
  }
}