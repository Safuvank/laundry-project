"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activateAdminUser } from "../api/admin.api";

export const useActivateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => activateAdminUser(userId),

    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "users", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
};
