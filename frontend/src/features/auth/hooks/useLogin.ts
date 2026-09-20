"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login } from "../api/login.api";
import { useAuthStore } from "@/stores/auth.store";

export const useLogin = () => {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const { accessToken, user } = response.data;

     

      // Store the NEW access token and user
      // in Zustand + localStorage persistence.
      setAuth(accessToken, user);

      // Go to customer dashboard
      router.push("/dashboard");
    },

    onError: (error) => {
      console.error("❌ LOGIN FAILED:", error);
    },
  });
};
