import axiosInstance from "@/utils/axios";

export const fetchDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Fetch dashboard stats failed:", error);
    return null;
  }
};
