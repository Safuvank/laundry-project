"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "../api/orders.api";

export const useOrder = (orderId?: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
    staleTime: 30 * 1000,
  });
};
