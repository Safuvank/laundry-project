"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/stores/auth.store";

import type {
  AuthUser,
  MeResponse,
  RefreshTokenResponse,
} from "@/features/auth/types/auth.types";

export default function GoogleCallbackPage() {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [error, setError] = useState<string | null>(null);

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    const completeGoogleLogin = async () => {
      try {
        /*
         * --------------------------------------------------------------------
         * STEP 1
         * --------------------------------------------------------------------
         *
         * The backend Google callback has already stored the FreshFold
         * refresh token inside an HTTP-only cookie.
         *
         * We now exchange that refresh token for a FreshFold access token.
         */

        const refreshResponse =
          await api.post<RefreshTokenResponse>("/auth/refresh");

        const accessToken = refreshResponse.data.data.accessToken;

        if (!accessToken) {
          throw new Error("Access token was not returned by the server.");
        }

        /*
         * --------------------------------------------------------------------
         * STEP 2
         * --------------------------------------------------------------------
         *
         * Fetch the authenticated FreshFold user.
         *
         * Axios request interceptor will automatically attach:
         *
         * Authorization: Bearer <accessToken>
         *
         * because we temporarily set the token in the store below.
         */

        useAuthStore.getState().setAccessToken(accessToken);

        const meResponse = await api.get<MeResponse>("/auth/me");

        const user: AuthUser = meResponse.data.data;

        if (!user) {
          throw new Error("Authenticated user information was not returned.");
        }

        /*
         * --------------------------------------------------------------------
         * STEP 3
         * --------------------------------------------------------------------
         *
         * Store both:
         *
         * - accessToken
         * - authenticated user
         *
         * in Zustand.
         */

        setAuth(accessToken, user);

        /*
         * --------------------------------------------------------------------
         * STEP 4
         * --------------------------------------------------------------------
         *
         * Google authentication is complete.
         *
         * Redirect the user to the home page.
         */

        router.replace("/");
      } catch (error) {
        console.error("Google authentication callback failed:", error);

        /*
         * Clear any partially-created authentication state.
         */

        useAuthStore.getState().clearAuth();

        setError(
          error instanceof Error
            ? error.message
            : "Google login failed. Please try again.",
        );
      }
    };

    completeGoogleLogin();
  }, [router, setAuth]);

  /*
   * --------------------------------------------------------------------------
   * ERROR STATE
   * --------------------------------------------------------------------------
   */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-xl text-red-600">!</span>
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Google Login Failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">{error}</p>

          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------------------------------
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

        <h1 className="mt-5 text-lg font-semibold text-gray-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Completing your Google authentication.
        </p>
      </div>
    </main>
  );
}
