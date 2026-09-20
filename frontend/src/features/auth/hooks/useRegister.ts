"use client";

import { useMutation } from "@tanstack/react-query";
import { register } from "../api/register.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
