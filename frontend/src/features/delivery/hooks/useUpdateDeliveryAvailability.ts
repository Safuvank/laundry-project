"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeliveryAvailability } from "../api/delivery-agents.api";

export const useUpdateDeliveryAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deliveryAgentId,
      status,
    }: {
      deliveryAgentId: string;
      status: string;
    }) => updateDeliveryAvailability(deliveryAgentId, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery", "profile"],
      });
    },
  });
};
