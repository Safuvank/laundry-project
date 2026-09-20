"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestCustomerApproval } from "../api/admin.api";

export const useRequestCustomerApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => {
      return requestCustomerApproval(orderId);
    },

    onSuccess: (_, orderId) => {
      // Admin order list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Admin order details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", orderId],
      });

      // Customer order details
      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });
    },
  });
};
