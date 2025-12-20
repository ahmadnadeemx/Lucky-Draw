import axios from "axios";
import toast from "react-hot-toast";
import { getAuthHeaders } from "../utils/getAuthHeaders";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("api response : ", response?.data);
    if (response?.data?.showMessage) {
      toast.success(response?.data?.message);
    }
    return response;
  },
  (error) => {
    console.log("api error : ", error);

    if (error.response) {
      if (error?.response?.data?.showMessage) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } else if (error.request) {
      toast.error(
        "No response from the server. Please check your network connection."
      );
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
