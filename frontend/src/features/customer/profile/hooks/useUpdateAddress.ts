"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAddress } from "../api/address.api";
import type { UpdateAddressPayload } from "../types/address.types";

interface UpdateAddressVariables {
  addressId: string;
  payload: UpdateAddressPayload;
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      payload,
    }: UpdateAddressVariables) =>
      updateAddress(addressId, payload),

    onSuccess: (updatedAddress) => {
      // Update the individual address in the cache.
      queryClient.setQueryData(
        ["customer", "address", updatedAddress._id],
        updatedAddress,
      );

      // Refresh the customer's address list.
      queryClient.invalidateQueries({
        queryKey: ["customer", "addresses"],
      });
    },
  });
};
