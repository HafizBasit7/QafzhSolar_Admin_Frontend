import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdsService } from "../../API_Callings/Advertisements/AdsService";

export const adsKeys = {
  all: ["ads"],
  lists: () => [...adsKeys.all, "list"],
  list: (filters) => [...adsKeys.lists(), { filters }],
  details: () => [...adsKeys.all, "detail"],
  detail: (id) => [...adsKeys.details(), id],
};

export const useAds = () => {
  return useQuery({
    queryKey: adsKeys.list(),
    queryFn: async () => {
      const response = await AdsService.getAllAds();
      // The API returns { status, data: [...], total, currentPage, totalPages, message }
      // AdsService.getAllAds() returns response.data, which is the whole response object
      // We need to extract the 'data' property which contains the ads array
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdsService.addAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
    },
  });
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adId, adData }) => AdsService.updateAd(adId, adData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adsKeys.detail(variables.adId),
      });
    },
  });
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdsService.deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
    },
  });
};
