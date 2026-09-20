import { useQuery } from "@tanstack/react-query";

import { getMyAssignments } from "../api/delivery-assignments.api";

export function useMyAssignments() {
  return useQuery({
    queryKey: ["delivery", "assignments"],
    queryFn: getMyAssignments,

    // Refetch when the user comes back to the dashboard.
    refetchOnWindowFocus: true,

    // Keep the assignment data reasonably fresh.
    staleTime: 30_000,

    // Automatically check for new assignments every 30 seconds.
    refetchInterval: 30_000,

    // Continue polling only while the page is visible.
    refetchIntervalInBackground: false,
  });
}
