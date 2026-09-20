"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeDelivery } from "../api/delivery-assignments.api";

export const useCompleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDelivery,

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
