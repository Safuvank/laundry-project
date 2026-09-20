"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminOrderById } from "../api/admin.api";

export const useAdminOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["admin", "orders", orderId],

    queryFn: () => getAdminOrderById(orderId),

    enabled: Boolean(orderId),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};
