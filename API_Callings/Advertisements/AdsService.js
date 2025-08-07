import AxiosInstance from "../../utils/AxiosInstance/axiosInstance";

export const AdsService = {
  // Get all ads
  getAllAds: async () => {
    try {
      const response = await AxiosInstance.get("/api/v1/ads/get/allAds");
      return response.data;
    } catch (error) {
      console.error("Error fetching ads:", error);
      throw error;
    }
  },

  // Add new ad
  addAd: async (adData) => {
    try {
      const response = await AxiosInstance.post("/api/v1/ads/postads", adData);
      return response.data;
    } catch (error) {
      console.error("Error adding ad:", error);
      throw error;
    }
  },

  // Update ad
  updateAd: async (adId, adData) => {
    try {
      const response = await AxiosInstance.put(
        `/api/v1/ads/update/${adId}`,
        adData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ad:", error);
      throw error;
    }
  },

  // Delete ad
  deleteAd: async (adId) => {
    try {
      const response = await AxiosInstance.delete(`/api/v1/ads/delete/${adId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting ad:", error);
      throw error;
    }
  },

  // Upload ad image
  uploadAdImage: async (file) => {
    try {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading ad image:", error);
      throw error;
    }
  },

  // Update ad with image upload
  updateAdWithImage: async (adId, adData, imageFile = null) => {
    try {
      let finalAdData = { ...adData };

      // If a new image file is provided, upload it first
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        finalAdData.imageUrl = imageUrl;
      }

      const response = await AxiosInstance.put(
        `/api/v1/ads/update/${adId}`,
        finalAdData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ad with image:", error);
      throw error;
    }
  },
};
