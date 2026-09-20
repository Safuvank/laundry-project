"use client";

import { useQuery } from "@tanstack/react-query";

import { getLaundryServices } from "../api/laundry-services.api";

export const useLaundryServices = () => {
  return useQuery({
    queryKey: ["laundry-services"],
    queryFn: getLaundryServices,
    staleTime: 5 * 60 * 1000,
  });
};
