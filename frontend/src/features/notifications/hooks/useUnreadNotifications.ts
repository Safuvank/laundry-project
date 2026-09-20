"use client";

import { useQuery } from "@tanstack/react-query";

import { getUnreadNotifications } from "../api/notifications.api";

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadNotifications,

    // Keep the dropdown data reasonably fresh.
    refetchInterval: 30 * 1000,

    refetchOnWindowFocus: true,

    staleTime: 10 * 1000,
  });
};
