"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth.store";

import { getMe } from "../api/me.api";

export const useMe = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: ["auth", "me"],

    queryFn: getMe,

    enabled: isHydrated && !!accessToken,

    staleTime: 5 * 60 * 1000,

    retry: false,

    select: (user) => {
      setUser(user);

      return user;
    },
  });
};
