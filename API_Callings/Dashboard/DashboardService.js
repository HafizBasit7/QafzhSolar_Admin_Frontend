import AxiosInstance from "../../utils/AxiosInstance/axiosInstance";

// Dashboard Service
export const DashboardService = {
  // Get dashboard counts
  getDashboardCounts: async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/v1/dashboard/simple-counts"
      );

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      let errorMessage = "Failed to fetch dashboard counts";

      // Try to get the most specific error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response?.data === "string") {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // Get dashboard analytics (for future use)
  getDashboardAnalytics: async () => {
    try {
      const response = await AxiosInstance.get("/api/v1/dashboard/analytics");

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      let errorMessage = "Failed to fetch dashboard analytics";

      // Try to get the most specific error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response?.data === "string") {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // Get recent activities (for future use)
  getRecentActivities: async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/v1/dashboard/recent-activities"
      );

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      let errorMessage = "Failed to fetch recent activities";

      // Try to get the most specific error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response?.data === "string") {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
};
