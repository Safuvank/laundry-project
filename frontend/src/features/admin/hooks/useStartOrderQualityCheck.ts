"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startOrderQualityCheck } from "../api/admin.api";

export const useStartOrderQualityCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => startOrderQualityCheck(orderId),

    onSuccess: (_, orderId) => {
      // Refresh admin orders list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Refresh admin order details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", orderId],
      });

      // Refresh customer order details if applicable
      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });
    },
  });
};

