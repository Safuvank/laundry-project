"use client";

import type {
  AdminDeliveryAgentListQuery,
  AdminDeliveryAgentStatus,
} from "@/features/admin/types/admin.types";

interface AdminDeliveryAgentFiltersProps {
  filters: {
    search?: string;
    status?: AdminDeliveryAgentStatus;
    isActive?: boolean;
  };

  onSearchChange: (value: string) => void;

  onStatusChange: (value: AdminDeliveryAgentStatus | undefined) => void;

  onActiveChange: (value: boolean | undefined) => void;

  onReset: () => void;
}

const statusOptions: AdminDeliveryAgentStatus[] = [
  "AVAILABLE",
  "BUSY",
  "OFFLINE",
  "INACTIVE",
];

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function AdminDeliveryAgentFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onActiveChange,
  onReset,
}: AdminDeliveryAgentFiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    typeof filters.isActive === "boolean";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label
            htmlFor="delivery-agent-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search
          </label>

          <input
            id="delivery-agent-search"
            type="text"
            value={filters.search ?? ""}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="delivery-agent-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="delivery-agent-status"
            value={filters.status ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              onStatusChange(
                value ? (value as AdminDeliveryAgentStatus) : undefined,
              );
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All Statuses</option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label
            htmlFor="delivery-agent-active"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Account Status
          </label>

          <select
            id="delivery-agent-active"
            value={
              typeof filters.isActive === "boolean"
                ? String(filters.isActive)
                : ""
            }
            onChange={(event) => {
              const value = event.target.value;

              if (value === "") {
                onActiveChange(undefined);
                return;
              }

              onActiveChange(value === "true");
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All Agents</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
