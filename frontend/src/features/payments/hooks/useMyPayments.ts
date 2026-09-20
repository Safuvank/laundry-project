"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyPayments } from "../api/payments.api";

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["payments", "my-payments"],
    queryFn: getMyPayments,
    staleTime: 30 * 1000,
  });
};