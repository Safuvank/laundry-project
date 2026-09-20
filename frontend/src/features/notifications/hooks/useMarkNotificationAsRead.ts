"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationAsRead } from "../api/notifications.api";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread"],
      });
    },
  });
};
