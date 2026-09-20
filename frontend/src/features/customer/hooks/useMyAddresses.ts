"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAddresses } from "../api/addresses.api";

export const useMyAddresses = () => {
  return useQuery({
    queryKey: ["customer", "addresses"],
    queryFn: getMyAddresses,
    staleTime: 5 * 60 * 1000,
  });
};
