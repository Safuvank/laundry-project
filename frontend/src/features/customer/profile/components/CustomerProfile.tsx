"use client";

import ProfileHeader from "./ProfileHeader";
import ProfileInformation from "./ProfileInformation";
import AddressSection from "./AddressSection";
import ChangePassword from "./ChangePassword";

import { useCustomerProfile } from "../hooks/useCustomerProfile";

export default function CustomerProfile() {
  const { data: profile, isLoading, isError, refetch } = useCustomerProfile();

  /*
   * Loading State
   */
  if (isLoading) {
    return (
      <main className="min-h-full bg-gray-50">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Page Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-4 w-32 rounded-md bg-gray-200" />

            <div className="mt-3 h-8 w-40 rounded-md bg-gray-200" />

            <div className="mt-3 h-4 w-full max-w-2xl rounded-md bg-gray-200" />
          </div>

          <div className="space-y-6">
            {/* Profile Header Skeleton */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-36 animate-pulse bg-gray-200" />

              <div className="space-y-4 p-6">
                <div className="h-5 w-40 rounded bg-gray-200" />

                <div className="h-4 w-52 rounded bg-gray-200" />

                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                  <div className="h-6 w-24 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Personal Information Skeleton */}
            <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm" />

            {/* Address Skeleton */}
            <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm" />

            {/* Security Skeleton */}
            <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error State
   */
  if (isError || !profile) {
    return (
      <main className="min-h-full bg-gray-50">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            {/* Error Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-red-500"
                aria-hidden="true"
              >
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.52 20h14.96a2 2 0 0 0 1.73-3.14l-7.5-13a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Unable to load your profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              We couldn't retrieve your profile information. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Profile Page
   */
  return (
    <main className="min-h-full bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Account</span>

              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1-.02-1.06L10.88 10 7.19 6.29a.75.75 0 1 1 1.08-1.04l4.2 4.25a.75.75 0 0 1 0 1.05l-4.2 4.25a.75.75 0 0 1-1.06-.03Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="font-medium text-gray-700">Profile</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage your personal information, saved addresses, profile
                picture, and account security.
              </p>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Profile Overview */}
          <section aria-labelledby="profile-overview">
            <h2 id="profile-overview" className="sr-only">
              Profile overview
            </h2>

            <ProfileHeader profile={profile} />
          </section>

          {/* Personal Information */}
          <section aria-labelledby="personal-information">
            <h2 id="personal-information" className="sr-only">
              Personal information
            </h2>

            <ProfileInformation profile={profile} />
          </section>

          {/* Saved Addresses */}
          <section aria-labelledby="saved-addresses">
            <h2 id="saved-addresses" className="sr-only">
              Saved addresses
            </h2>

            <AddressSection />
          </section>

          {/* Security */}
          <section aria-labelledby="account-security">
            <h2 id="account-security" className="sr-only">
              Account security
            </h2>

            <ChangePassword />
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            Your account information is securely stored and protected.
          </p>
        </div>
      </div>
    </main>
  );
}
