"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useChangePassword } from "../hooks/useChangePassword";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(1, "New password is required."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from current password.",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

type ChangePasswordFormData = z.infer<
  typeof changePasswordSchema
>;

export default function ChangePassword() {
  const changePassword = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          reset();

          /*
           * Your backend deletes all refresh tokens after
           * changing the password.
           *
           * The customer must therefore login again.
           *
           * Use your existing logout implementation here.
           */
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Security
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Change your password to keep your FreshFold account secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 max-w-xl space-y-5"
      >
        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>

          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("currentPassword")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-20 text-sm text-gray-900 outline-none transition ${
                errors.currentPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
              placeholder="Enter your current password"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            New Password
          </label>

          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("newPassword")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-20 text-sm text-gray-900 outline-none transition ${
                errors.newPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
              placeholder="Enter your new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-20 text-sm text-gray-900 outline-none transition ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
              placeholder="Confirm your new password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* API Error */}
        {changePassword.isError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {changePassword.error instanceof Error
              ? changePassword.error.message
              : "Failed to change password. Please try again."}
          </div>
        )}

        {/* Success */}
        {changePassword.isSuccess && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Password changed successfully. Please login again.
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {changePassword.isPending
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

