"use client";

import type { AdminUser } from "../../types/admin.types";

interface UsersTableProps {
  users: AdminUser[];
  onView: (userId: string) => void;
  onEdit: (user: AdminUser) => void;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;
  activatingUserId?: string | null;
  deactivatingUserId?: string | null;
}

function getRoleLabel(role: AdminUser["role"]) {
  switch (role) {
    case "USER":
      return "Customer";

    case "DELIVERY_AGENT":
      return "Delivery Agent";

    case "ADMIN":
      return "Admin";

    default:
      return role;
  }
}

function getStatusClasses(
  status: AdminUser["accountStatus"],
) {
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

export default function UsersTable({
  users,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  activatingUserId,
  deactivatingUserId,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          No users found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 font-semibold text-gray-700">
                User
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Contact
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Role
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Status
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Email
              </th>

              <th className="px-5 py-4 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const isActivating =
                activatingUserId === user._id;

              const isDeactivating =
                deactivatingUserId === user._id;

              return (
                <tr
                  key={user._id}
                  className="transition hover:bg-gray-50"
                >
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                          {user.firstName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID: {user._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4 text-gray-700">
                    {user.phoneNumber || "—"}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4 text-gray-700">
                    {getRoleLabel(user.role)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        user.accountStatus,
                      )}`}
                    >
                      {user.accountStatus}
                    </span>
                  </td>

                  {/* Email verification */}
                  <td className="px-5 py-4">
                    <span
                      className={
                        user.isEmailVerified
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {user.isEmailVerified
                        ? "Verified"
                        : "Not verified"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(user._id)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      {user.accountStatus === "ACTIVE" ? (
                        <button
                          type="button"
                          disabled={isDeactivating}
                          onClick={() =>
                            onDeactivate(user._id)
                          }
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeactivating
                            ? "..."
                            : "Deactivate"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isActivating}
                          onClick={() =>
                            onActivate(user._id)
                          }
                          className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isActivating
                            ? "..."
                            : "Activate"}
                        </button>
                      )}
                    </div>
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
