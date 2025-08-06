import AxiosInstance from "../../utils/AxiosInstance/axiosInstance";

// Engineer Service
export const EngineerService = {
  // Get all engineers
  getAllEngineers: async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/v1/marketplace/getAllEngineer"
      );

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      let errorMessage = "Failed to fetch engineers";

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

  // Add new engineer
  addEngineer: async (engineerData) => {
    try {
      const response = await AxiosInstance.post(
        "/api/v1/engineers/add",
        engineerData
      );

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      let errorMessage = "Failed to add engineer";

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

  // Update engineer
  updateEngineer: async (engineerId, engineerData) => {
    try {
      console.log("Updating engineer with ID:", engineerId);
      console.log("Update data:", engineerData);
      console.log("API URL:", `/api/v1/engineers/update/${engineerId}`);

      const response = await AxiosInstance.put(
        `/api/v1/engineers/update/${engineerId}`,
        engineerData
      );

      console.log("Update response:", response);

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Update engineer error:", error);
      console.error("Error response:", error.response);

      let errorMessage = "Failed to update engineer";

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

  // Delete engineer
  deleteEngineer: async (engineerId) => {
    try {
      const response = await AxiosInstance.delete(
        `/api/v1/engineers/delete/${engineerId}`
      );

      // Check if we have a valid response
      if (!response.data) {
        throw new Error("Empty response from server");
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      let errorMessage = "Failed to delete engineer";

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
