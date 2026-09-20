"use client";

import Link from "next/link";

import type {
  AdminDeliveryAssignment,
} from "../../types/admin.types";

interface AdminAssignmentsTableProps {
  assignments: AdminDeliveryAssignment[];
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

const getStatusClasses = (
  status: string,
) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "ACCEPTED":
      return "bg-blue-100 text-blue-700";

    case "OFFERED":
      return "bg-yellow-100 text-yellow-700";

    case "PENDING":
      return "bg-gray-100 text-gray-700";

    case "REJECTED":
    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (
  value: string,
) => {
  return new Date(value).toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
};

export default function AdminAssignmentsTable({
  assignments,
}: AdminAssignmentsTableProps) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6 text-gray-500"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="16"
              rx="2"
            />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No assignments found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          There are no assignments matching
          your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Type
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Delivery Agent
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Agent Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Assignment Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Active
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Created
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {assignments.map(
              (assignment) => {
                const agentUser =
                  assignment
                    .deliveryAgentId
                    .userId;

                return (
                  <tr
                    key={assignment._id}
                    className="hover:bg-gray-50"
                  >
                    {/* Order */}

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          #
                          {assignment.orderId._id.slice(
                            -8,
                          )}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatLabel(
                            assignment
                              .orderId
                              .status,
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Type */}

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        {assignment.assignmentType ===
                        "PICKUP" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M3 7h11v10H3z" />
                            <path d="M14 10h4l3 3v4h-7z" />
                            <circle
                              cx="7"
                              cy="19"
                              r="2"
                            />
                            <circle
                              cx="18"
                              cy="19"
                              r="2"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M12 3v15" />
                            <path d="m7 13 5 5 5-5" />
                          </svg>
                        )}

                        {formatLabel(
                          assignment.assignmentType,
                        )}
                      </span>
                    </td>

                    {/* Agent */}

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {agentUser.firstName}{" "}
                          {agentUser.lastName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {agentUser.email}
                        </p>
                      </div>
                    </td>

                    {/* Agent Status */}

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">
                        {formatLabel(
                          assignment
                            .deliveryAgentId
                            .status,
                        )}
                      </span>
                    </td>

                    {/* Assignment Status */}

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          assignment.status,
                        )}`}
                      >
                        {formatLabel(
                          assignment.status,
                        )}
                      </span>
                    </td>

                    {/* Active */}

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          assignment.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {assignment.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Created */}

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(
                        assignment.createdAt,
                      )}
                    </td>

                    {/* Action */}

                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/assignments/${assignment._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-950"
                      >
                        View

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}