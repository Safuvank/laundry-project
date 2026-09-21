import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/features/auth/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;

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
      /*
       * ------------------------------------------------------------------------
       * INITIAL STATE
       * ------------------------------------------------------------------------
       */

      accessToken: null,
      user: null,

      isHydrated: false,

      /*
       * ------------------------------------------------------------------------
       * SET AUTH
       * ------------------------------------------------------------------------
       *
       * Used when both access token and user information
       * are available.
       *
       * Example:
       *
       * Normal login
       * Google login callback
       */

      setAuth: (accessToken, user) =>
        set({
          accessToken,
          user,
        }),

      /*
       * ------------------------------------------------------------------------
       * SET ACCESS TOKEN
       * ------------------------------------------------------------------------
       *
       * Used when we receive a new access token from:
       *
       * POST /auth/refresh
       *
       * This is especially important for the Google OAuth
       * callback flow.
       */

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      /*
       * ------------------------------------------------------------------------
       * SET USER
       * ------------------------------------------------------------------------
       */

      setUser: (user) =>
        set({
          user,
        }),

      /*
       * ------------------------------------------------------------------------
       * SET HYDRATED
       * ------------------------------------------------------------------------
       *
       * Zustand persist uses localStorage.
       *
       * This tells the application that the persisted
       * authentication state has been restored.
       */

      setHydrated: (value) =>
        set({
          isHydrated: value,
        }),

      /*
       * ------------------------------------------------------------------------
       * CLEAR AUTH
       * ------------------------------------------------------------------------
       *
       * Used during logout.
       */

      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),
    {
      /*
       * Persist authentication state in localStorage.
       */

      name: "freshfold-auth",

      /*
       * Restore persisted state after application startup.
       */

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
