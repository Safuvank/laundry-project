"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsAsRead } from "../api/notifications.api";

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

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
