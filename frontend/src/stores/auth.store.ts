import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/features/auth/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;

  /*
   * True after Zustand has restored the persisted
   * authentication state from localStorage.
   */
  isHydrated: boolean;

  setAuth: (accessToken: string, user: AuthUser) => void;

  setAccessToken: (accessToken: string) => void;

  setUser: (user: AuthUser) => void;

  setHydrated: (value: boolean) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /* ------------------------------------------------------------------ */
      /* INITIAL STATE                                                     */
      /* ------------------------------------------------------------------ */

      accessToken: null,

      user: null,

      isHydrated: false,

      /* ------------------------------------------------------------------ */
      /* SET AUTH                                                           */
      /* ------------------------------------------------------------------ */

      /**
       * Store both:
       *
       * - access token
       * - authenticated user
       *
       * Used after:
       *
       * Normal login
       * Google OAuth callback
       */
      setAuth: (accessToken, user) => {
        set({
          accessToken,
          user,
        });
      },

      /* ------------------------------------------------------------------ */
      /* SET ACCESS TOKEN                                                   */
      /* ------------------------------------------------------------------ */

      /**
       * Used when:
       *
       * POST /auth/refresh
       *
       * returns a new access token.
       */
      setAccessToken: (accessToken) => {
        set({
          accessToken,
        });
      },

      /* ------------------------------------------------------------------ */
      /* SET USER                                                           */
      /* ------------------------------------------------------------------ */

      setUser: (user) => {
        set({
          user,
        });
      },

      /* ------------------------------------------------------------------ */
      /* SET HYDRATED                                                       */
      /* ------------------------------------------------------------------ */

      /**
       * Zustand persist calls this after localStorage
       * has been restored.
       */
      setHydrated: (value) => {
        set({
          isHydrated: value,
        });
      },

      /* ------------------------------------------------------------------ */
      /* CLEAR AUTH                                                         */
      /* ------------------------------------------------------------------ */

      /**
       * Used during logout or when refresh authentication
       * completely fails.
       */
      clearAuth: () => {
        set({
          accessToken: null,
          user: null,
        });
      },
    }),

    {
      name: "freshfold-auth",

      /*
       * Only authentication data is persisted.
       *
       * isHydrated intentionally remains runtime-only.
       */
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),

      /*
       * Called after Zustand restores localStorage.
       */
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
