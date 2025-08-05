import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HandleSignIn } from "../../API_Callings/Auth/SignIn/HandleSignIn";

// Query keys for auth
export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
  login: () => [...authKeys.all, "login"],
};

// Login mutation hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => HandleSignIn(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.setQueryData(authKeys.user(), data.data);
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
};

// Get current user hook
export const useCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    data: user,
    isLoading: false,
    error: null,
  };
};

// Check authentication status
export const useAuthStatus = () => {
  const authToken = localStorage.getItem("authToken");
  const isLoggedIn = authToken && localStorage.getItem("isLoggedIn") === "true";

  return {
    isAuthenticated: !!isLoggedIn,
    isLoading: false,
  };
};

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Clear all queries
    queryClient.clear();
  };

  return { logout };
};
