import AxiosInstance from "../../utils/AxiosInstance/axiosInstance";

export const ShopService = {
  // Get all shops
  getAllShops: async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/v1/marketplace/getAllShops"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  },

  // Get single shop details
  getShopDetails: async (shopId) => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/marketplace/getOneShop/${shopId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shop details:", error);
      throw error;
    }
  },

  // Add new shop
  addShop: async (shopData) => {
    try {
      const response = await AxiosInstance.post("/api/v1/shops/add", shopData);
      return response.data;
    } catch (error) {
      console.error("Error adding shop:", error);
      throw error;
    }
  },

  // Update shop
  updateShop: async (shopId, shopData) => {
    try {
      const response = await AxiosInstance.put(
        `/api/v1/shops/update/${shopId}`,
        shopData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating shop:", error);
      throw error;
    }
  },

  // Delete shop
  deleteShop: async (shopId) => {
    try {
      const response = await AxiosInstance.delete(
        `/api/v1/shops/delete/${shopId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting shop:", error);
      throw error;
    }
  },
};
