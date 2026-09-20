"use client";

import type { CustomerProfile } from "../types/profile.types";

interface ProfileHeaderProps {
  profile: CustomerProfile;
}

export default function ProfileHeader({
  profile,
}: ProfileHeaderProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gray-900 px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Profile Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-white text-2xl font-bold text-gray-700">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {profile.firstName.charAt(0).toUpperCase()}
                {profile.lastName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Customer Information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">
                {fullName}
              </h2>

              {profile.isEmailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Verified
                </span>
              )}
            </div>

            <p className="mt-1 truncate text-sm text-gray-300">
              {profile.email}
            </p>

            {profile.phoneNumber && (
              <p className="mt-1 text-sm text-gray-400">
                {profile.phoneNumber}
              </p>
            )}
          </div>

          {/* Account Status */}
          <div className="sm:self-start">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                profile.accountStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : profile.accountStatus === "SUSPENDED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {profile.accountStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="px-6 py-4 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Account Type
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {profile.role}
          </p>
        </div>

        <div className="px-6 py-4 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Member Since
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {new Date(profile.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
