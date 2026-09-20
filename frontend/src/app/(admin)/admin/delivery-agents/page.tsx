"use client";

import { useEffect, useState } from "react";

import AdminDeliveryAgentFilters from "@/features/admin/components/delivery-agents/AdminDeliveryAgentFilters";
import AdminDeliveryAgentsTable from "@/features/admin/components/delivery-agents/AdminDeliveryAgentsTable";
import AdminDeliveryAgentsPagination from "@/features/admin/components/delivery-agents/AdminDeliveryAgentsPagination";

import { useAdminDeliveryAgents } from "@/features/admin/hooks/useAdminDeliveryAgents";

import type {
  AdminDeliveryAgentListQuery,
  AdminDeliveryAgentStatus,
} from "@/features/admin/types/admin.types";

export default function AdminDeliveryAgentsPage() {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string | undefined>(undefined);

  const [status, setStatus] = useState<AdminDeliveryAgentStatus | undefined>(
    undefined,
  );

  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  /*
   * ------------------------------------------------------------------------
   * Search debounce
   * ------------------------------------------------------------------------
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim() ? searchInput.trim() : undefined);

      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /*
   * ------------------------------------------------------------------------
   * Query
   * ------------------------------------------------------------------------
   */

  const filters: AdminDeliveryAgentListQuery = {
    page,
    limit: 10,

    ...(search && { search }),

    ...(status && { status }),

    ...(typeof isActive === "boolean" && {
      isActive,
    }),
  };

  const { data, isLoading, isError, error, refetch } =
    useAdminDeliveryAgents(filters);

  /*
   * ------------------------------------------------------------------------
   * Handlers
   * ------------------------------------------------------------------------
   */

  const handleStatusChange = (value: AdminDeliveryAgentStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch(undefined);
    setStatus(undefined);
    setIsActive(undefined);
    setPage(1);
  };

  /*
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Agents</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor delivery agents.
          </p>
        </div>

        {/* Filters */}
        <AdminDeliveryAgentFilters
          filters={{
            search: searchInput,
            status,
            isActive,
          }}
          onSearchChange={setSearchInput}
          onStatusChange={handleStatusChange}
          onActiveChange={handleActiveChange}
          onReset={handleReset}
        />

        {/* Content */}
        <div className="mt-6">
          {/* Loading */}
          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading delivery agents...
              </p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-red-600">
                Failed to load delivery agents.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Data */}
          {!isLoading && !isError && data && (
            <>
              {/* Result Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Agents
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {data.data.pagination.total} total delivery agents
                  </p>
                </div>
              </div>

              {/* Table */}
              <AdminDeliveryAgentsTable
                deliveryAgents={data.data.deliveryAgents}
              />

              {/* Pagination */}
              <AdminDeliveryAgentsPagination
                page={data.data.pagination.page}
                totalPages={data.data.pagination.totalPages}
                total={data.data.pagination.total}
                limit={data.data.pagination.limit}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
