"use client";

import { useMutation } from "@tanstack/react-query";

import { logout } from "../api/logout.api";

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};
