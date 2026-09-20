"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrderPricing } from "../api/admin.api";

interface UpdateOrderPricingPayload {
  orderId: string;
  finalPrice: number;
}

export const useUpdateOrderPricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      finalPrice,
    }: UpdateOrderPricingPayload) => {
      return updateOrderPricing(orderId, finalPrice);
    },

    onSuccess: (_, variables) => {
      // Admin order list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Admin order details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.orderId],
      });

      // Customer order details
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });
    },
  });
};
