import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../../API_Callings/Dashboard/DashboardService";

// Query keys for dashboard
export const dashboardKeys = {
  all: ["dashboard"],
  counts: () => [...dashboardKeys.all, "counts"],
  analytics: () => [...dashboardKeys.all, "analytics"],
  activities: () => [...dashboardKeys.all, "activities"],
};

// Dashboard counts hook
export const useDashboardCounts = () => {
  return useQuery({
    queryKey: dashboardKeys.counts(),
    queryFn: DashboardService.getDashboardCounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Dashboard analytics hook (for future use)
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: dashboardKeys.analytics(),
    queryFn: DashboardService.getDashboardAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: false, // Disabled by default until API is available
  });
};

// Recent activities hook (for future use)
export const useRecentActivities = () => {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: DashboardService.getRecentActivities,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: false, // Disabled by default until API is available
  });
};
