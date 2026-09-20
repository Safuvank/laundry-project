"use client";

import { useMutation } from "@tanstack/react-query";

import { logoutAll } from "../api/logout-all.api";

export const useLogoutAll = () => {
  return useMutation({
    mutationFn: logoutAll,
  });
};
