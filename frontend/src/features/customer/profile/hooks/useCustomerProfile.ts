"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerProfile } from "../api/profile.api";

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ["customer", "profile"],
    queryFn: getCustomerProfile,
    staleTime: 5 * 60 * 1000,
  });
};