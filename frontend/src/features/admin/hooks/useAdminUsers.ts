"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminUsers } from "../api/admin.api";
import type { AdminUserListQuery } from "../types/admin.types";

export const useAdminUsers = (
  query: AdminUserListQuery = {},
) => {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getAdminUsers(query),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};