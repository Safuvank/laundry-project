"use client";

import { useQuery } from "@tanstack/react-query";

import { getDeliveryProfile } from "../api/delivery-agents.api";

export const useDeliveryProfile = () => {
  return useQuery({
    queryKey: ["delivery", "profile"],
    queryFn: getDeliveryProfile,
    staleTime: 30 * 1000,
  });
};
