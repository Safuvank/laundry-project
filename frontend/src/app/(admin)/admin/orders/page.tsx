"use client";

import { useEffect, useState } from "react";

import AdminOrderFilters from "@/features/admin/components/orders/AdminOrderFilters";
import AdminOrdersTable from "@/features/admin/components/orders/AdminOrdersTable";
import AdminOrdersPagination from "@/features/admin/components/orders/AdminOrdersPagination";

import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";

import type {
  AdminOrderListQuery,
  AdminOrderPaymentStatus,
  AdminOrderStatus,
} from "@/features/admin/types/admin.types";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState<string | undefined>(undefined);

  const [status, setStatus] = useState<AdminOrderStatus | undefined>(undefined);

  const [paymentStatus, setPaymentStatus] = useState<
    AdminOrderPaymentStatus | undefined
  >(undefined);

  /*
   * --------------------------------------------------------------------------
   * Debounce Search
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim() ? searchInput.trim() : undefined);

      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /*
   * --------------------------------------------------------------------------
   * Query Filters
   * --------------------------------------------------------------------------
   */

  const filters: AdminOrderListQuery = {
    page,
    limit: 10,

    ...(search && {
      search,
    }),

    ...(status && {
      status,
    }),

    ...(paymentStatus && {
      paymentStatus,
    }),
  };

  /*
   * --------------------------------------------------------------------------
   * Get Orders
   * --------------------------------------------------------------------------
   */

  const { data, isLoading, isError, error, refetch } = useAdminOrders(filters);

  /*
   * --------------------------------------------------------------------------
   * Filter Handlers
   * --------------------------------------------------------------------------
   */

  const handleStatusChange = (value: AdminOrderStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handlePaymentStatusChange = (
    value: AdminOrderPaymentStatus | undefined,
  ) => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch(undefined);
    setStatus(undefined);
    setPaymentStatus(undefined);
    setPage(1);
  };

  /*
   * --------------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor customer orders.
          </p>
        </div>

        {/* Filters */}
        <AdminOrderFilters
          filters={{
            search: searchInput,
            status,
            paymentStatus,
          }}
          onSearchChange={setSearchInput}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onReset={handleReset}
        />

        {/* Orders */}
        <div className="mt-6">
          {/* Loading */}
          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-500">Loading orders...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-red-600">
                Failed to load orders.
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

          {/* Success */}
          {!isLoading && !isError && data && (
            <>
              {/* Orders Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {data.data.pagination.total} total orders
                  </p>
                </div>
              </div>

              {/* Orders Table */}
              <AdminOrdersTable orders={data.data.orders} />

              {/* Pagination */}
              <AdminOrdersPagination
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
