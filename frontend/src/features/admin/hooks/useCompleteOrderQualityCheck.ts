"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOrderQualityCheck } from "../api/admin.api";

export const useCompleteOrderQualityCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      completeOrderQualityCheck(orderId),

    onSuccess: (_, orderId) => {
      // Refresh admin orders list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Refresh admin order details
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
