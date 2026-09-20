"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rejectAssignment } from "../api/delivery-assignments.api";

export const useRejectAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      payload,
    }: {
      assignmentId: string;
      payload?: {
        rejectionReason?: string;
      };
    }) => rejectAssignment(assignmentId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery", "assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["delivery", "profile"],
      });
    },
  });
};
