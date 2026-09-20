"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAddresses } from "../api/address.api";

export const useAddresses = () => {
  return useQuery({
    queryKey: ["customer", "addresses"],
    queryFn: getMyAddresses,

    // Addresses don't usually change frequently.
    staleTime: 5 * 60 * 1000,

    // Fetch again when the user returns to the tab.
    refetchOnWindowFocus: true,
  });
};
