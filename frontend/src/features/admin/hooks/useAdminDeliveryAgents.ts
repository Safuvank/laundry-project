"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDeliveryAgents } from "../api/admin.api";

import type {
  AdminDeliveryAgentListQuery,
} from "../types/admin.types";

export const useAdminDeliveryAgents = (
  query: AdminDeliveryAgentListQuery = {},
) => {
  return useQuery({
    queryKey: ["admin", "delivery-agents", query],
    queryFn: () => getAdminDeliveryAgents(query),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};