"use client";

import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationCount } from "../api/notifications.api";

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,

    // Refresh the notification badge every 30 seconds.
    refetchInterval: 30 * 1000,

    // Also refresh when the user comes back to the browser tab.
    refetchOnWindowFocus: true,

    staleTime: 10 * 1000,
  });
};
