"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptAssignment } from "../api/delivery-assignments.api";

export const useAcceptAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptAssignment,

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
