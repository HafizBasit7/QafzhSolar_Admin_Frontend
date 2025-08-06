import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../../API_Callings/Product/ProductService";

// Query keys for products
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
};

// Hook to get all products
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const response = await ProductService.getAllProducts();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get single product details
export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: async () => {
      const response = await ProductService.getProductDetails(productId);
      return response.data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to update product status
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, updateData }) => {
      const response = await ProductService.updateProductStatus(
        productId,
        updateData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      // Update the specific product in cache if it exists
      queryClient.setQueryData(productKeys.detail(variables.productId), data);
    },
    onError: (error) => {
      console.error("Failed to update product status:", error);
    },
  });
};
