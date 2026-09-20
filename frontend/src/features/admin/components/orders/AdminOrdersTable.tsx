"use client";

import Link from "next/link";
import {
  Eye,
  Package,
} from "lucide-react";

import type { AdminOrder } from "../../types/admin.types";

interface AdminOrdersTableProps {
  orders: AdminOrder[];
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

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatCurrency = (
  amount?: number,
) => {
  if (
    amount === undefined ||
    amount === null
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const getOrderStatusClasses = (
  status: string,
) => {
  switch (status) {
    case "BOOKED":
      return "bg-blue-50 text-blue-700";

    case "PICKUP_ASSIGNED":
    case "DELIVERY_ASSIGNED":
      return "bg-indigo-50 text-indigo-700";

    case "OUT_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      return "bg-orange-50 text-orange-700";

    case "PICKED_UP":
    case "RECEIVED_AT_FACILITY":
      return "bg-purple-50 text-purple-700";

    case "PROCESSING":
    case "INSPECTION_IN_PROGRESS":
    case "QUALITY_CHECK":
      return "bg-yellow-50 text-yellow-700";

    case "READY_FOR_DELIVERY":
      return "bg-cyan-50 text-cyan-700";

    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
    case "PICKUP_FAILED":
    case "DELIVERY_FAILED":
      return "bg-red-50 text-red-700";

    case "ON_HOLD":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentStatusClasses = (
  status: string,
) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700";

    case "PENDING":
      return "bg-yellow-50 text-yellow-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "REFUNDED":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AdminOrdersTable({
  orders,
}: AdminOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <Package
          className="mx-auto h-10 w-10 text-gray-400"
          strokeWidth={1.5}
        />

        <h3 className="mt-3 text-sm font-semibold text-gray-900">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pickup Date
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const customer =
                order.userId;

              const customerName =
                customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "Unknown customer";

              const displayPrice =
                order.finalPrice ??
                order.estimatedPrice;

              return (
                <tr
                  key={order._id}
                  className="transition hover:bg-gray-50"
                >
                  {/* Order ID */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          order.createdAt,
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customerName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {customer?.email ??
                          "No email"}
                      </p>

                      {customer?.phoneNumber && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {
                            customer.phoneNumber
                          }
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Pickup Date */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {formatDate(
                        order.pickupDate,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {order.pickupTimeSlot}
                    </p>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        displayPrice,
                      )}
                    </p>

                    {order.finalPrice !==
                      undefined &&
                      order.estimatedPrice !==
                        undefined &&
                      order.finalPrice !==
                        order.estimatedPrice && (
                        <p className="mt-1 text-xs text-gray-400">
                          Est.{" "}
                          {formatCurrency(
                            order.estimatedPrice,
                          )}
                        </p>
                      )}
                  </td>

                  {/* Order Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClasses(
                        order.status,
                      )}`}
                    >
                      {formatLabel(
                        order.status,
                      )}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                        order.paymentStatus,
                      )}`}
                    >
                      {formatLabel(
                        order.paymentStatus,
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />

                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile hint */}
      <div className="border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-400 md:hidden">
        Swipe horizontally to view all
        order information.
      </div>
    </div>
  );
}
