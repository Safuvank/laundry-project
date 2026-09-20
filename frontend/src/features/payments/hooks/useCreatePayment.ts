"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPayment } from "../api/payments.api";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,

    onSuccess: (payment) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments", "order", payment.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", payment.orderId],
      });
    },
  });
};
