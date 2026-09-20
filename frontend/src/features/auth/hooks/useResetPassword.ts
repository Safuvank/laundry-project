"use client";

import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "../api/reset-password.api";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
