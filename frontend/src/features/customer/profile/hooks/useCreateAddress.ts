"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "../api/address.api";
import type { CreateAddressPayload } from "../types/address.types";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),

    onSuccess: () => {
      // Refresh the customer's saved addresses.
      queryClient.invalidateQueries({
        queryKey: ["customer", "addresses"],
      });
    },
  });
};
