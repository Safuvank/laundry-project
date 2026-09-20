"use client";

import { useMutation } from "@tanstack/react-query";

import { changeCustomerPassword } from "../api/profile.api";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changeCustomerPassword,
  });
};