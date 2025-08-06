import axios from "axios";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB max
        maxBodyLength: 10 * 1024 * 1024, // 10MB max
      }
    );

    const data = response.data;
    // console.log("Upload Response:", data); // Debugging

    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "Image upload failed.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    if (error.response?.status === 413) {
      throw new Error(
        "Image is too large. Please try uploading a smaller image."
      );
    }
    throw error;
  }
};

export const uploadVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB max for videos
        maxBodyLength: 50 * 1024 * 1024, // 50MB max for videos
        timeout: 300000, // 5 minutes timeout for large video uploads
      }
    );

    const data = response.data;
    // console.log("Video Upload Response:", data); // Debugging

    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "Video upload failed.");
    }
  } catch (error) {
    console.error("Error uploading video:", error);
    if (error.response?.status === 413) {
      throw new Error(
        "Video is too large. Please try uploading a smaller video (max 50MB)."
      );
    }
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      throw new Error(
        "Video upload timed out. Please check your internet connection and try again."
      );
    }
    throw error;
  }
};

// Helper function to detect file type
const getFileType = (file) => {
  if (file instanceof File) {
    return file.type;
  }

  // Check file extension
  const fileName = file.name || file.uri || "";
  const extension = fileName.split(".").pop()?.toLowerCase();

  const videoExtensions = [
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "webm",
    "m4v",
    "3gp",
  ];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  if (videoExtensions.includes(extension)) {
    return "video";
  } else if (imageExtensions.includes(extension)) {
    return "image";
  }

  return "file";
};

export const uploadFile = async (file, fileName) => {
  try {
    const formData = new FormData();

    // If we receive a File object directly
    if (file instanceof File) {
      formData.append("file", file);
    }
    // If we receive a prepared object with uri (from our frontend)
    else if (file.uri) {
      // Convert the uri to a blob
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Create a File object from the blob
      const fileToUpload = new File([blob], file.name || fileName || "file", {
        type: file.type || blob.type,
      });
      formData.append("file", fileToUpload);
    } else {
      throw new Error("Invalid file object provided");
    }

    const response = await axios.post(
      "https://srv694651.hstgr.cloud/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "ayzenn09876@",
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB
        maxBodyLength: 10 * 1024 * 1024,
      }
    );

    const data = response.data;
    if (data.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data.message || "File upload failed.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error.response?.status === 413) {
      throw new Error("File is too large. Please upload a smaller file.");
    }
    throw error;
  }
};

// General media upload function that automatically detects file type
export const uploadMedia = async (file, fileName) => {
  try {
    const fileType = getFileType(file);

    if (fileType === "video") {
      return await uploadVideo(file);
    } else if (fileType === "image") {
      return await uploadImage(file);
    } else {
      return await uploadFile(file, fileName);
    }
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};
