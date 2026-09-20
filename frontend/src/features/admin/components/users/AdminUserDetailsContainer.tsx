"use client";

import UserDetails from "./UserDetails";

import { useAdminUser } from "../../hooks/useAdminUser";

interface AdminUserDetailsContainerProps {
  userId: string;
}

export default function AdminUserDetailsContainer({
  userId,
}: AdminUserDetailsContainerProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminUser(userId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />

        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />

        <div className="mt-6 h-56 animate-pulse rounded-xl bg-gray-200" />

        <div className="mt-6 h-48 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Failed to load user
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading the user."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            User not found.
          </p>
        </div>
      </div>
    );
  }

  return <UserDetails user={data.data} />;
}
