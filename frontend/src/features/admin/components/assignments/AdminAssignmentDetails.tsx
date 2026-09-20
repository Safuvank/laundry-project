"use client";

import Link from "next/link";

import type {
  AdminDeliveryAssignment,
} from "../../types/admin.types";

interface AdminAssignmentDetailsProps {
  assignment: AdminDeliveryAssignment;
}

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
};

const statusClasses = (
  status: string,
) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "ACCEPTED":
      return "bg-blue-100 text-blue-700";

    case "OFFERED":
      return "bg-yellow-100 text-yellow-700";

    case "REJECTED":
    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AdminAssignmentDetails({
  assignment,
}: AdminAssignmentDetailsProps) {
  const agentUser =
    assignment.deliveryAgentId.userId;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/assignments"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Assignments
          </Link>

          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Assignment Details
          </h1>

          <p className="mt-1 break-all text-sm text-gray-500">
            ID: {assignment._id}
          </p>
        </div>

        <div className="flex gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${statusClasses(
              assignment.status,
            )}`}
          >
            {formatLabel(
              assignment.status,
            )}
          </span>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${
              assignment.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {assignment.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* Assignment Overview */}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Assignment Overview
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Order
            </p>

            <p className="mt-1 break-all font-medium text-gray-900">
              #{assignment.orderId._id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Order Status
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatLabel(
                assignment.orderId.status,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Assignment Type
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatLabel(
                assignment.assignmentType,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Assignment Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
                assignment.status,
              )}`}
            >
              {formatLabel(
                assignment.status,
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Delivery Agent */}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-gray-700"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
            />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>

          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Agent
          </h2>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Name
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {agentUser.firstName}{" "}
              {agentUser.lastName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Email
            </p>

            <p className="mt-1 break-all text-sm text-gray-900">
              {agentUser.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Phone
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {agentUser.phoneNumber ||
                assignment.deliveryAgentId
                  .phoneNumber ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Agent Status
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatLabel(
                assignment
                  .deliveryAgentId
                  .status,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-gray-700"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <path d="M12 7v5l3 2" />
          </svg>

          <h2 className="text-lg font-semibold text-gray-900">
            Assignment Timeline
          </h2>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Created
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.createdAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Offered
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.offeredAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Accepted
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.acceptedAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rejected
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.rejectedAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Completed
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.completedAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Last Updated
            </p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(
                assignment.updatedAt,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Rejection Reason */}

      {assignment.rejectionReason && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Rejection Reason
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {assignment.rejectionReason}
          </p>
        </section>
      )}
    </div>
  );
}