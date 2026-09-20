"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "../api/admin.api";

import type {
  AdminOrderListQuery,
} from "../types/admin.types";

export const useAdminOrders = (
  query: AdminOrderListQuery = {},
) => {
  return useQuery({
    queryKey: ["admin", "orders", query],

    queryFn: () => getAdminOrders(query),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};