"use client";

import type {
  AdminDeliveryAssignmentStatus,
  AdminDeliveryAssignmentType,
} from "../../types/admin.types";

interface AdminAssignmentFiltersProps {
  searchInput: string;

  status:
    | AdminDeliveryAssignmentStatus
    | "";

  assignmentType:
    | AdminDeliveryAssignmentType
    | "";

  isActive: "" | "true" | "false";

  hasFilters: boolean;

  onSearchInputChange: (
    value: string,
  ) => void;

  onSearch: () => void;

  onStatusChange: (
    value:
      | AdminDeliveryAssignmentStatus
      | "",
  ) => void;

  onAssignmentTypeChange: (
    value:
      | AdminDeliveryAssignmentType
      | "",
  ) => void;

  onIsActiveChange: (
    value: "" | "true" | "false",
  ) => void;

  onReset: () => void;
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

export default function AdminAssignmentFilters({
  searchInput,
  status,
  assignmentType,
  isActive,
  hasFilters,
  onSearchInputChange,
  onSearch,
  onStatusChange,
  onAssignmentTypeChange,
  onIsActiveChange,
  onReset,
}: AdminAssignmentFiltersProps) {
  const statuses: AdminDeliveryAssignmentStatus[] = [
    "PENDING",
    "OFFERED",
    "ACCEPTED",
    "REJECTED",
    "CANCELLED",
    "COMPLETED",
  ];

  const assignmentTypes: AdminDeliveryAssignmentType[] = [
    "PICKUP",
    "DELIVERY",
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Search */}

        <div className="lg:col-span-1">
          <label
            htmlFor="assignment-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search
          </label>

          <div className="flex">
            <input
              id="assignment-search"
              type="text"
              value={searchInput}
              onChange={(event) =>
                onSearchInputChange(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearch();
                }
              }}
              placeholder="Agent name, email or phone"
              className="min-w-0 flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />

            <button
              type="button"
              onClick={onSearch}
              aria-label="Search assignments"
              className="rounded-r-lg border border-l-0 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status */}

        <div>
          <label
            htmlFor="assignment-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="assignment-status"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target
                  .value as
                  | AdminDeliveryAssignmentStatus
                  | "",
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">
              All statuses
            </option>

            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {formatLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Type */}

        <div>
          <label
            htmlFor="assignment-type"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Assignment Type
          </label>

          <select
            id="assignment-type"
            value={assignmentType}
            onChange={(event) =>
              onAssignmentTypeChange(
                event.target
                  .value as
                  | AdminDeliveryAssignmentType
                  | "",
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">
              All types
            </option>

            {assignmentTypes.map((item) => (
              <option
                key={item}
                value={item}
              >
                {formatLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {/* Active */}

        <div>
          <label
            htmlFor="assignment-active"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Active
          </label>

          <select
            id="assignment-active"
            value={isActive}
            onChange={(event) =>
              onIsActiveChange(
                event.target.value as
                  | ""
                  | "true"
                  | "false",
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">
              All
            </option>

            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}