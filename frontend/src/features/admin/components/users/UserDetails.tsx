"use client";

import { useRouter } from "next/navigation";

import type { AdminUser } from "../../types/admin.types";

interface UserDetailsProps {
  user: AdminUser;
}

function getRoleLabel(role: AdminUser["role"]) {
  switch (role) {
    case "USER":
      return "Customer";

    case "DELIVERY_AGENT":
      return "Delivery Agent";

    case "ADMIN":
      return "Administrator";

    default:
      return role;
  }
}

function getStatusClasses(status: AdminUser["accountStatus"]) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-700";

    case "BLOCKED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

export default function UserDetails({ user }: UserDetailsProps) {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="mb-3 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Users
          </button>

          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>

          <p className="mt-1 text-sm text-gray-500">
            View detailed information about this user.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/admin/users/${user._id}/edit`)}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Edit User
        </button>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-700">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>

            <p className="mt-1 text-sm text-gray-500">{user.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {getRoleLabel(user.role)}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                  user.accountStatus,
                )}`}
              >
                {user.accountStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="First Name" value={user.firstName} />

          <DetailItem label="Last Name" value={user.lastName} />

          <DetailItem label="Email" value={user.email} />

          <DetailItem label="Phone Number" value={user.phoneNumber || "—"} />

          <DetailItem label="Role" value={getRoleLabel(user.role)} />

          <DetailItem
            label="Account Status"
            value={
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                  user.accountStatus,
                )}`}
              >
                {user.accountStatus}
              </span>
            }
          />
        </div>
      </section>

      {/* Account Information */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Account Information
        </h2>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Email Verification"
            value={
              user.isEmailVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-yellow-600">Not Verified</span>
              )
            }
          />

          <DetailItem label="Last Login" value={formatDate(user.lastLoginAt)} />

          <DetailItem label="Created At" value={formatDate(user.createdAt)} />

          <DetailItem label="Updated At" value={formatDate(user.updatedAt)} />

          <DetailItem
            label="User ID"
            value={
              <span className="break-all font-mono text-xs">{user._id}</span>
            }
          />
        </div>
      </section>
    </div>
  );
}
