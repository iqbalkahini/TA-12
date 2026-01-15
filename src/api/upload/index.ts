import axiosInstance from "@/utils/axios";

export async function uploadImage(image: File) {
  try {
    const res = await axiosInstance.post(
      "/api/upload/image",
      {
        files: [image],
      },
      {
        headers: {
          "Content-Type": "image/jpeg",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function uploadImages(files: FormData) {
  try {
    const res = await axiosInstance.post("/api/upload/images", files, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
