"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useVerifyEmail } from "../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyMutation.mutate({
      token,
    });

    // Run verification only when the token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 sm:px-10">
        
        {/* =====================================================
            STATE 1: CHECK YOUR EMAIL
            User arrives here immediately after registration.
            URL: /verify-email
        ===================================================== */}
        {!token && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Check your email
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              We've sent a verification link to your email address.
              Please open the email and click the verification link to
              activate your account.
            </p>

            <p className="mt-4 text-xs text-gray-400">
              Didn't receive the email? Check your spam or junk folder.
            </p>

            <Link
              href="/login"
              className="mt-8 flex w-full items-center justify-center rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100"
            >
              Back to Login
            </Link>
          </div>
        )}

        {/* =====================================================
            STATE 2: VERIFYING
            URL: /verify-email?token=...
        ===================================================== */}
        {token && verifyMutation.isPending && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
              <svg
                className="h-8 w-8 animate-spin text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Verifying email...
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Please wait a moment while we securely verify your email
              address.
            </p>
          </div>
        )}

        {/* =====================================================
            STATE 3: SUCCESS
        ===================================================== */}
        {token && verifyMutation.isSuccess && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Email Verified!
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Your email has been successfully verified. Your account is
              now active and ready to go.
            </p>

            <Link
              href="/login"
              className="mt-8 flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in to freshfold
            </Link>
          </div>
        )}

        {/* =====================================================
            STATE 4: VERIFICATION ERROR
        ===================================================== */}
        {token && verifyMutation.isError && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Verification failed
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              This verification link appears to be invalid or has expired.
              Please request a new verification email.
            </p>

            <Link
              href="/login"
              className="mt-8 flex w-full items-center justify-center rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}