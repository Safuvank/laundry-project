"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deactivateAdminUser } from "../api/admin.api";

export const useDeactivateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      deactivateAdminUser(userId),

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
