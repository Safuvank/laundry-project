"use client";

import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "../api/forgot-password.api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};
