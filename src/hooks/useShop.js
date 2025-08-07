import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShopService } from "../../API_Callings/Shop/ShopService";

export const shopKeys = {
  all: ["shops"],
  lists: () => [...shopKeys.all, "list"],
  list: (filters) => [...shopKeys.lists(), { filters }],
  details: () => [...shopKeys.all, "detail"],
  detail: (id) => [...shopKeys.details(), id],
};

export const useShops = () => {
  return useQuery({
    queryKey: shopKeys.list(),
    queryFn: async () => {
      const response = await ShopService.getAllShops();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShopDetails = (shopId) => {
  return useQuery({
    queryKey: shopKeys.detail(shopId),
    queryFn: async () => {
      const response = await ShopService.getShopDetails(shopId);
      return response.data;
    },
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ShopService.addShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
    },
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shopId, shopData }) =>
      ShopService.updateShop(shopId, shopData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: shopKeys.detail(variables.shopId),
      });
    },
  });
};

export const useDeleteShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ShopService.deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.lists() });
    },
  });
};
