"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completePickup } from "../api/delivery-assignments.api";

export const useCompletePickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completePickup,

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
