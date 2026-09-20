"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/notifications.api";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 30 * 1000,
  });
};
