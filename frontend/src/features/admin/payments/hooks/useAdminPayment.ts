"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminPaymentById } from "../api/admin-payments.api";

export const useAdminPayment = (paymentId: string) => {
  return useQuery({
    queryKey: ["admin", "payments", paymentId],

    queryFn: () => getAdminPaymentById(paymentId),

    enabled: Boolean(paymentId),
  });
};