import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EngineerService } from "../../API_Callings/Engineer/EngineerService";

// Query keys for engineer
export const engineerKeys = {
  all: ["engineer"],
  lists: () => [...engineerKeys.all, "list"],
  list: (filters) => [...engineerKeys.lists(), { filters }],
  details: () => [...engineerKeys.all, "detail"],
  detail: (id) => [...engineerKeys.details(), id],
};

// Get all engineers hook
export const useEngineers = () => {
  return useQuery({
    queryKey: engineerKeys.list(),
    queryFn: EngineerService.getAllEngineers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Add engineer mutation hook
export const useAddEngineer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (engineerData) => EngineerService.addEngineer(engineerData),
    onSuccess: () => {
      // Invalidate and refetch engineers list
      queryClient.invalidateQueries({ queryKey: engineerKeys.lists() });
    },
    onError: (error) => {
      // Error handling is done in the component
      console.error("Add engineer error:", error);
    },
  });
};

// Update engineer mutation hook (for future use)
export const useUpdateEngineer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ engineerId, engineerData }) =>
      EngineerService.updateEngineer(engineerId, engineerData),
    onSuccess: () => {
      // Invalidate and refetch engineers list
      queryClient.invalidateQueries({ queryKey: engineerKeys.lists() });
    },
    onError: (error) => {
      // Error handling is done in the component
      console.error("Update engineer error:", error);
    },
  });
};

// Delete engineer mutation hook (for future use)
export const useDeleteEngineer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (engineerId) => EngineerService.deleteEngineer(engineerId),
    onSuccess: () => {
      // Invalidate and refetch engineers list
      queryClient.invalidateQueries({ queryKey: engineerKeys.lists() });
    },
    onError: (error) => {
      // Error handling is done in the component
      console.error("Delete engineer error:", error);
    },
  });
};
