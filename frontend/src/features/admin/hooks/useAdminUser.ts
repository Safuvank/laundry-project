"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminUserById } from "../api/admin.api";

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => getAdminUserById(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
};
