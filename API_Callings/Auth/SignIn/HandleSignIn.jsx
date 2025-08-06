import AxiosInstance from "../../../utils/AxiosInstance/axiosInstance";

export const HandleSignIn = async (credentials) => {
  try {
    const response = await AxiosInstance.post("/api/v1/admin-auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Check if we have a valid response
    if (!response.data) {
      throw new Error("Empty response from server");
    }

    // Store token in localStorage if provided
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.data.user._id);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(response.data.data.user.permissions)
      );
      localStorage.setItem("isLoggedIn", "true");
    }

    // Return the response data directly
    return {
      success: true,
      message: "Login successful",
      data: response.data, // Pass through the original response data
    };
  } catch (error) {
    let errorMessage = "Login failed";

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
};
