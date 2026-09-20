"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminAssignments } from "../api/admin.api";

import type {
  AdminAssignmentListQuery,
} from "../types/admin.types";

export const useAdminAssignments = (
  query: AdminAssignmentListQuery = {},
) => {
  return useQuery({
    queryKey: ["admin", "assignments", query],

    queryFn: () => getAdminAssignments(query),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};