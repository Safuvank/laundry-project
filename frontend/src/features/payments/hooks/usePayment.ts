"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaymentById } from "../api/payments.api";

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
    staleTime: 30 * 1000,
  });
};
