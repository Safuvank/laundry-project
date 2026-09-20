"use client";

import { useQuery } from "@tanstack/react-query";

import { getPickupSlotsByDate } from "../api/pickup-slots.api";

export const usePickupSlots = (date: string) => {
  return useQuery({
    queryKey: ["pickup-slots", date],
    queryFn: () => getPickupSlotsByDate(date),
    enabled: Boolean(date),
    staleTime: 30 * 1000,
  });
};
