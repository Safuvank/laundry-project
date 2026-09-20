"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startDelivery } from "../api/delivery-assignments.api";

export const useStartDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startDelivery,

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
