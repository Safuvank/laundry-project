"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCustomerProfile } from "../api/profile.api";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerProfile,

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["customer", "profile"],
        data,
      );
    },
  });
};