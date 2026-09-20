"use client";

import Link from "next/link";

import type {
  AdminDeliveryAgent,
  AdminDeliveryAgentStatus,
} from "@/features/admin/types/admin.types";

interface AdminDeliveryAgentsTableProps {
  deliveryAgents: AdminDeliveryAgent[];
}

const getStatusClasses = (status: AdminDeliveryAgentStatus) => {
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

const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatPhoneNumber = (phoneNumber?: string | null) => {
  return phoneNumber || "—";
};

const getAgentLocation = (agent: AdminDeliveryAgent) => {
  if (
    !agent.currentLocation ||
    !Array.isArray(agent.currentLocation.coordinates) ||
    agent.currentLocation.coordinates.length !== 2
  ) {
    return null;
  }

  const [longitude, latitude] = agent.currentLocation.coordinates;

  return {
    longitude,
    latitude,
  };
};

export default function AdminDeliveryAgentsTable({
  deliveryAgents,
}: AdminDeliveryAgentsTableProps) {
  if (deliveryAgents.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">
          No delivery agents found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Agent
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Availability
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Location
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email Verified
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {deliveryAgents.map((agent) => {
              const location = getAgentLocation(agent);

              const user = agent.userId;

              return (
                <tr key={agent._id} className="transition hover:bg-gray-50">
                  {/* Agent */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ID: {agent._id}
                      </p>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{user.email}</p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatPhoneNumber(
                          agent.phoneNumber || user.phoneNumber,
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        agent.status,
                      )}`}
                    >
                      {formatStatus(agent.status)}
                    </span>
                  </td>

                  {/* Availability */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          agent.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />

                      <span className="text-sm text-gray-700">
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-4">
                    {location ? (
                      <div>
                        <p className="text-sm text-gray-900">
                          Location available
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {location.latitude.toFixed(5)},{" "}
                          {location.longitude.toFixed(5)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Not available
                      </span>
                    )}
                  </td>

                  {/* Email Verified */}
                  <td className="px-4 py-4">
                    {user.isEmailVerified ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                        Not Verified
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/delivery-agents/${agent._id}`}
                      className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
