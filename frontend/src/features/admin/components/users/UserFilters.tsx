"use client";

import type {
  AdminUserAccountStatus,
  AdminUserRole,
} from "../../types/admin.types";

interface UserFiltersProps {
  search: string;
  role: AdminUserRole | "";
  accountStatus: AdminUserAccountStatus | "";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: AdminUserRole | "") => void;
  onAccountStatusChange: (
    value: AdminUserAccountStatus | "",
  ) => void;
  onReset: () => void;
}

export default function UserFilters({
  search,
  role,
  accountStatus,
  onSearchChange,
  onRoleChange,
  onAccountStatusChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label
            htmlFor="user-search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search
          </label>

          <input
            id="user-search"
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search name, email or phone..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="user-role"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Role
          </label>

          <select
            id="user-role"
            value={role}
            onChange={(event) =>
              onRoleChange(
                event.target.value as AdminUserRole | "",
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All Roles</option>
            <option value="USER">Customer</option>
            <option value="DELIVERY_AGENT">
              Delivery Agent
            </option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Account Status */}
        <div>
          <label
            htmlFor="user-status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="user-status"
            value={accountStatus}
            onChange={(event) =>
              onAccountStatusChange(
                event.target.value as
                  | AdminUserAccountStatus
                  | "",
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
