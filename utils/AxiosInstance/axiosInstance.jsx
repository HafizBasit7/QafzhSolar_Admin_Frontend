import axios from "axios";
import { baseurl } from "../../API_Callings/BaseURL/Baseurl";

const axiosInstance = axios.create({
  baseURL: baseurl,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // Ensure config.headers exists
    config.headers = config.headers || {};

    // Only use token from localStorage if available
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
