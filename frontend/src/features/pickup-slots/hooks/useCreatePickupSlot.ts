"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createPickupSlot } from "../api/pickup-slots.api";

export const useCreatePickupSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPickupSlot,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-pickup-slots"],
      });
    },
  });
};
