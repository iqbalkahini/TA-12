import { FormDataPermohonan, Siswa } from "@/types/api";
import axiosInstance from "@/utils/axios";

export const getSiswa = async (
  search?: string,
  page?: number,
  kelas_id?: number,
  jurusan_id?: number
) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (kelas_id) params.append("kelas_id", kelas_id.toString());
    if (jurusan_id) params.append("jurusan_id", jurusan_id.toString());
    if (page) params.append("page", page.toString());

    const url = `/api/siswa?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Get siswa failed:", error);
    return null;
  }
};

export const getSiswaById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/siswa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get siswa by id failed:", error);
    return null;
  }
};

export const createSiswa = async (data: Siswa) => {
  try {
    const response = await axiosInstance.post("/api/siswa", data);
    return response.data;
  } catch (error) {
    console.error("Create siswa failed:", error);
    return null;
  }
};

export const updateSiswa = async (id: number, data: Siswa) => {
  try {
    const response = await axiosInstance.put(`/api/siswa/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update siswa failed:", error);
    return null;
  }
};

export const deleteSiswa = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/api/siswa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete siswa failed:", error);
    return null;
  }
};

export const createPengajuan = async (data: FormDataPermohonan) => {
  try {
    const response = await axiosInstance.post("/api/pkl/applications", data);
    return response.data;
  } catch (error) {
    console.log("error history pengajuan: ", error);
    return null;
  }
};

export const historyPengajuan = async () => {
  try {
    const response = await axiosInstance.get("/api/pkl/applications/me");
    return response.data;
  } catch (error) {
    console.log("error history pengajuan: ", error);
    return null;
  }
};
