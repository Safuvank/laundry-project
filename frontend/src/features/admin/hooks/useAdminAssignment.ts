"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminAssignmentById } from "../api/admin.api";

export const useAdminAssignment = (assignmentId: string) => {
  return useQuery({
    queryKey: ["admin", "assignments", assignmentId],

    queryFn: () => getAdminAssignmentById(assignmentId),

    enabled: Boolean(assignmentId),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
};
