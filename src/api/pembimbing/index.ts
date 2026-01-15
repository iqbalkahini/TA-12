import { PostRealisasiKegiatanPkl } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function kegiatanPklActive() {
  try {
    const res = await axiosInstance.get("/api/kegiatan-pkl/active");
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function kegiatanPklById(id: number) {
  try {
    const res = await axiosInstance.get(`/api/kegiatan-pkl/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getIndustri() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/industri`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getSiswa() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/siswa`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getTasksRealisasiPkl() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/tasks`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function realisasiKegiatanPkl() {
  try {
    const res = await axiosInstance.get(`/api/realisasi-kegiatan/me`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getRealisasiKegiatanPklById(id: number) {
  try {
    const res = await axiosInstance.get(`/api/realisasi-kegiatan/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function createRealisasiKegiatanPkl(
  data: PostRealisasiKegiatanPkl
) {
  try {
    const res = await axiosInstance.post(`/api/realisasi-kegiatan`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
