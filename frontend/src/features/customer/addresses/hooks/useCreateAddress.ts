"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "../api/addresses.api";
import type { CreateAddressPayload } from "../types/address.types";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["addresses", "me"],
      });
    },
  });
};
