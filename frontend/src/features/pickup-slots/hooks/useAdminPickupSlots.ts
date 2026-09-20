"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminPickupSlots } from "../api/pickup-slots.api";

export const useAdminPickupSlots = () => {
  return useQuery({
    queryKey: ["admin-pickup-slots"],
    queryFn: getAdminPickupSlots,
    staleTime: 30 * 1000,
  });
};
