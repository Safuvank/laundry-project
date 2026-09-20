"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setDefaultAddress } from "../api/address.api";

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),

    onSuccess: (updatedAddress) => {
      // Update the individual address cache if it exists.
      queryClient.setQueryData(
        ["customer", "address", updatedAddress._id],
        updatedAddress,
      );

      // Refresh the complete address list.
      // This is important because the previous default
      // address must also lose its isDefault status.
      queryClient.invalidateQueries({
        queryKey: ["customer", "addresses"],
      });
    },
  });
};
