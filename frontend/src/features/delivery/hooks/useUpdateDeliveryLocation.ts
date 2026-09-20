"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeliveryLocation } from "../api/delivery-agents.api";

export const useUpdateDeliveryLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeliveryLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery", "profile"],
      });
    },
  });
};
