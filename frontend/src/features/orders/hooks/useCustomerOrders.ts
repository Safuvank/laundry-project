"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerOrders } from "../api/orders.api";
import type { Order } from "../types/order.types";

export const useCustomerOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["customer", "orders"],
    queryFn: getCustomerOrders,
    staleTime: 30 * 1000,
  });
};
