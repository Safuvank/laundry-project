"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAdminUser } from "../api/admin.api";
import type { AdminUpdateUserPayload } from "../types/admin.types";

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminUpdateUserPayload;
    }) => updateAdminUser(userId, payload),

    onSuccess: async (_, variables) => {
      // Refresh Users table
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      // Refresh specific user
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users", variables.userId],
      });

      // IMPORTANT:
      // Refresh Delivery Agents table
      await queryClient.invalidateQueries({
        queryKey: ["admin", "delivery-agents"],
      });

      // Refresh dashboard statistics
      await queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
};