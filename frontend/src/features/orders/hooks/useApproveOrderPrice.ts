"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrderPrice } from "../api/orders.api";

export const useApproveOrderPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => approveOrderPrice(orderId),

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
