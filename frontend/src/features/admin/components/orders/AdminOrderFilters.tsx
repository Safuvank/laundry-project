"use client";

import type {
  AdminOrderListQuery,
  AdminOrderPaymentStatus,
  AdminOrderStatus,
} from "../../types/admin.types";

interface AdminOrderFiltersProps {
  filters: AdminOrderListQuery;

  onSearchChange: (value: string) => void;

  onStatusChange: (
    value: AdminOrderStatus | undefined,
  ) => void;

  onPaymentStatusChange: (
    value: AdminOrderPaymentStatus | undefined,
  ) => void;

  onReset: () => void;
}

const ORDER_STATUSES: AdminOrderStatus[] = [
  "DRAFT",
  "BOOKED",
  "PICKUP_ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "RECEIVED_AT_FACILITY",
  "INSPECTION_IN_PROGRESS",
  "PRICE_FINALIZED",
  "CUSTOMER_APPROVAL_PENDING",
  "PROCESSING",
  "QUALITY_CHECK",
  "READY_FOR_DELIVERY",
  "DELIVERY_ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "PICKUP_FAILED",
  "DELIVERY_FAILED",
  "ON_HOLD",
];

const PAYMENT_STATUSES: AdminOrderPaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

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

export default function AdminOrderFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
}: AdminOrderFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.paymentStatus);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label
            htmlFor="order-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search
          </label>

          <input
            id="order-search"
            type="text"
            value={filters.search ?? ""}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search customer name, email or phone..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Order Status */}
        <div>
          <label
            htmlFor="order-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Order Status
          </label>

          <select
            id="order-status"
            value={filters.status ?? ""}
            onChange={(event) =>
              onStatusChange(
                event.target.value
                  ? (event.target
                      .value as AdminOrderStatus)
                  : undefined,
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">
              All statuses
            </option>

            {ORDER_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label
            htmlFor="payment-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Payment Status
          </label>

          <select
            id="payment-status"
            value={filters.paymentStatus ?? ""}
            onChange={(event) =>
              onPaymentStatusChange(
                event.target.value
                  ? (event.target
                      .value as AdminOrderPaymentStatus)
                  : undefined,
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">
              All payment statuses
            </option>

            {PAYMENT_STATUSES.map(
              (paymentStatus) => (
                <option
                  key={paymentStatus}
                  value={paymentStatus}
                >
                  {formatLabel(paymentStatus)}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* Reset */}
      {hasFilters && (
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