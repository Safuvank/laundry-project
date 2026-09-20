"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startPickup } from "../api/delivery-assignments.api";

export const useStartPickup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startPickup,

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
