"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDeliveryAgentById } from "../api/admin.api";

export const useAdminDeliveryAgent = (
  deliveryAgentId: string,
) => {
  return useQuery({
    queryKey: ["admin", "delivery-agents", deliveryAgentId],

    queryFn: () =>
      getAdminDeliveryAgentById(deliveryAgentId),

    enabled: Boolean(deliveryAgentId),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};