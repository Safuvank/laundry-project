"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAddress } from "../api/address.api";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),

    onSuccess: (_, addressId) => {
      // Remove the individual address from the cache.
      queryClient.removeQueries({
        queryKey: ["customer", "address", addressId],
      });

      // Refresh the customer's saved addresses.
      queryClient.invalidateQueries({
        queryKey: ["customer", "addresses"],
      });
    },
  });
};
