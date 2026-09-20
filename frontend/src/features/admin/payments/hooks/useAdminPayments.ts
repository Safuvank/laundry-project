"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminPayments } from "../api/admin-payments.api";
import type { AdminPaymentListQuery } from "../types/admin-payment.types";

export const useAdminPayments = (
  query: AdminPaymentListQuery = {},
) => {
  return useQuery({
    queryKey: ["admin", "payments", query],

    queryFn: () => getAdminPayments(query),

    placeholderData: (previousData) => previousData,
  });
};