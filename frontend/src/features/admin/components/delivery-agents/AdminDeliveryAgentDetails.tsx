"use client";

import Link from "next/link";

import type {
  AdminDeliveryAgent,
  AdminDeliveryAgentStatus,
} from "@/features/admin/types/admin.types";

interface AdminDeliveryAgentDetailsProps {
  deliveryAgent: AdminDeliveryAgent;
}

const getStatusClasses = (
  status: AdminDeliveryAgentStatus,
) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "BUSY":
      return "bg-yellow-100 text-yellow-700";

    case "OFFLINE":
      return "bg-gray-100 text-gray-700";

    case "INACTIVE":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatStatus = (value: string) => {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value?: string) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatPhone = (
  phoneNumber?: string | null,
) => {
  return phoneNumber || "—";
};

export default function AdminDeliveryAgentDetails({
  deliveryAgent,
}: AdminDeliveryAgentDetailsProps) {
  const user = deliveryAgent.userId;

  const location =
    deliveryAgent.currentLocation;

  const hasLocation =
    location &&
    Array.isArray(location.coordinates) &&
    location.coordinates.length === 2;

  const [longitude, latitude] = hasLocation
    ? location.coordinates
    : [undefined, undefined];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">

        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <Link
            href="/admin/delivery-agents"
            className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to Delivery Agents
          </Link>

          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Delivery Agent
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                ID: {deliveryAgent._id}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                deliveryAgent.status,
              )}`}
            >
              {formatStatus(
                deliveryAgent.status,
              )}
            </span>
          </div>
        </div>

        <div className="space-y-6">

          {/* ---------------------------------------------------------------- */}
          {/* Profile */}
          {/* ---------------------------------------------------------------- */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic delivery agent information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-gray-900">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formatPhone(
                    deliveryAgent.phoneNumber ||
                      user.phoneNumber,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Role
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formatStatus(user.role)}
                </p>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Account */}
          {/* ---------------------------------------------------------------- */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Account
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Account and verification status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">

              {/* Active */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Agent Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      deliveryAgent.isActive
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />

                  <span className="text-sm font-medium text-gray-900">
                    {deliveryAgent.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email Verification
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.isEmailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isEmailVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              </div>

              {/* Account Status */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Account Status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {formatStatus(
                    user.accountStatus,
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Operational Status */}
          {/* ---------------------------------------------------------------- */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Operational Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current delivery agent availability.
              </p>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                      deliveryAgent.status,
                    )}`}
                  >
                    {formatStatus(
                      deliveryAgent.status,
                    )}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Record Availability
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {deliveryAgent.isActive
                      ? "Available for system operations"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Current Location */}
          {/* ---------------------------------------------------------------- */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Location
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest location reported by the delivery agent.
              </p>
            </div>

            <div className="p-5">
              {hasLocation &&
              latitude !== undefined &&
              longitude !== undefined ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {location.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Latitude
                    </p>

                    <p className="mt-1 font-mono text-sm text-gray-900">
                      {latitude.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Longitude
                    </p>

                    <p className="mt-1 font-mono text-sm text-gray-900">
                      {longitude.toFixed(6)}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-5 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Location not available
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This delivery agent has not reported a
                    current location.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Record Information */}
          {/* ---------------------------------------------------------------- */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Record Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Delivery agent record timestamps.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Created At
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    deliveryAgent.createdAt,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    deliveryAgent.updatedAt,
                  )}
                </p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}