"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { initiatePayment } from "../api/payments.api";

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiatePayment,

    onSuccess: (payment) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments", payment._id],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments", "order", payment.orderId],
      });
    },
  });
};
