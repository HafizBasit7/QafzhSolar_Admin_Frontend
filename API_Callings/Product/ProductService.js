import AxiosInstance from "../../utils/AxiosInstance/axiosInstance";

// Product Service
export const ProductService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/v1/marketplace/browse-products"
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
      let errorMessage = "Failed to fetch products";

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

  // Get single product details
  getProductDetails: async (productId) => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/marketplace/getOneProduct/${productId}`
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
      let errorMessage = "Failed to fetch product details";

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

  // Update product status (approve/reject)
  updateProductStatus: async (productId, updateData) => {
    try {
      const response = await AxiosInstance.put(
        `/api/v1/products/update-product/${productId}`,
        updateData
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
      let errorMessage = "Failed to update product";

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
