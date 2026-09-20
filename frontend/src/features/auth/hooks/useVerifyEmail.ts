"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyEmail } from "../api/verify-email.api";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
