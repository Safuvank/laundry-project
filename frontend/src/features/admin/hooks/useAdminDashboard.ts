"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../api/admin.api";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
