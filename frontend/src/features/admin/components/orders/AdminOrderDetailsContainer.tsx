"use client";

import AdminOrderDetails from "./AdminOrderDetails";

import { useAdminOrder } from "../../hooks/useAdminOrder";

interface AdminOrderDetailsContainerProps {
  orderId: string;
}

export default function AdminOrderDetailsContainer({
  orderId,
}: AdminOrderDetailsContainerProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-red-600">
              Failed to load order.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {error instanceof Error
                ? error.message
                : "Something went wrong."}
            </p>

            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Order not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminOrderDetails
      order={data.data}
    />
  );
}
