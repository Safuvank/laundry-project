"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../validators/forgot-password.schema";

import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  // Upgraded Success State UI matching the modern design
  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="flex w-full flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Check your email
        </h2>
        
        <p className="mt-2 text-sm text-gray-500">
          If an account exists for that email, we have sent a password reset link. Please check your inbox and spam folder.
        </p>
        
        <Link
          href="/login"
          className="mt-8 flex w-full items-center justify-center rounded-lg bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            {...register("email")}
            className="block w-full rounded-lg border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* API Error Alert */}
      {forgotPasswordMutation.isError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Something went wrong. Please try again later.
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="mt-2 flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:opacity-70"
      >
        {forgotPasswordMutation.isPending ? "Sending reset link..." : "Send reset link"}
      </button>

      {/* Back to Login Link */}
      <p className="pt-2 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
        >
          Log in here
        </Link>
      </p>
    </form>
  );
}