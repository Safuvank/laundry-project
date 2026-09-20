"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CustomerProfile } from "../types/profile.types";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

interface ProfileInformationProps {
  profile: CustomerProfile;
}

const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name cannot exceed 50 characters."),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileInformation({
  profile,
}: ProfileInformationProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber ?? "",
    },
  });

  useEffect(() => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber ?? "",
    });
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      },
      {
        onSuccess: () => {
          reset(data);
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your personal information associated with your FreshFold
          account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
      >
        {/* First Name / Last Name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register("firstName")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition ${
                errors.firstName
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
              placeholder="Enter your first name"
            />

            {errors.firstName && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register("lastName")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition ${
                errors.lastName
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
              placeholder="Enter your last name"
            />

            {errors.lastName && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 outline-none"
          />

          <p className="mt-1.5 text-xs text-gray-400">
            Email address cannot be changed from your profile.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            {...register("phoneNumber")}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition ${
              errors.phoneNumber
                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            }`}
            placeholder="Enter 10 digit phone number"
          />

          {errors.phoneNumber && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Success Message */}
        {updateProfile.isSuccess && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Profile updated successfully.
          </div>
        )}

        {/* Error Message */}
        {updateProfile.isError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {updateProfile.error instanceof Error
              ? updateProfile.error.message
              : "Failed to update profile. Please try again."}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isDirty || updateProfile.isPending}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateProfile.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
