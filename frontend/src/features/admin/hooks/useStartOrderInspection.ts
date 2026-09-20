"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startOrderInspection } from "../api/admin.api";

export const useStartOrderInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => {
      return startOrderInspection(orderId);
    },

    onSuccess: (_, orderId) => {
      // Refresh admin order list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Refresh current admin order details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", orderId],
      });

      // Refresh customer order details
      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });
    },
  });
};
