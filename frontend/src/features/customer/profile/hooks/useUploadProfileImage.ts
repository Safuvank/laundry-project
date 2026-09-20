"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfileImage } from "../api/profile.api";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["customer", "profile"],
        data,
      );
    },
  });
};