import { FormDataPermohonanKapro } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function ListGuruPembimbing(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const response = await axiosInstance.get(
      `/api/pkl/pembimbing?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function ListIndustri(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const response = await axiosInstance.get(
      `/api/pkl/industri/preview?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function ListPermohonanPKL(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("siswa_username", search);
    const response = await axiosInstance.get(
      `/api/pkl/applications?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function ApprovePermohonanPKL(
  id: number,
  form: FormDataPermohonanKapro
) {
  try {
    const response = await axiosInstance.put(
      `/api/pkl/applications/${id}/approve`,
      form
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function RejectPermohonanPKL(
  id: number,
  form: FormDataPermohonanKapro
) {
  try {
    const response = await axiosInstance.put(
      `/api/pkl/applications/${id}/reject`,
      form
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
