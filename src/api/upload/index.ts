import axiosInstance from "@/utils/axios";

export async function uploadImage(image: File) {
  try {
    const res = await axiosInstance.post("/api/upload/image", image);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function uploadImages(images: File[]) {
  try {
    const res = await axiosInstance.post("/api/upload/image", images);
    return res.data;
  } catch (error) {
    throw error;
  }
}
