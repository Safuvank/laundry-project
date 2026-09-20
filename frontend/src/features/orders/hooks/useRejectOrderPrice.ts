"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectOrderPrice } from "../api/orders.api";

export const useRejectOrderPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => rejectOrderPrice(orderId),

    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
