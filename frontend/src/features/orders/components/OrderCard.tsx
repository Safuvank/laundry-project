"use client";

import Link from "next/link";

import type { Order } from "@/features/orders/types/order.types";
import { OrderStatus } from "@/lib/constants/order-status";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
}

const formatStatus = (status: OrderStatus) => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return "bg-emerald-50 text-emerald-700";

    case OrderStatus.CANCELLED:
      return "bg-red-50 text-red-700";

    case OrderStatus.CUSTOMER_APPROVAL_PENDING:
      return "bg-amber-50 text-amber-700";

    case OrderStatus.OUT_FOR_PICKUP:
    case OrderStatus.OUT_FOR_DELIVERY:
      return "bg-indigo-50 text-indigo-700";

    default:
      return "bg-blue-50 text-blue-700";
  }
};

export default function OrderCard({ order }: OrderCardProps) {
  const displayPrice = order.finalPrice ?? order.estimatedPrice;

  const priceLabel =
    order.finalPrice !== undefined ? "Final Price" : "Estimated Price";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Order
          </p>

          <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
            #{order._id}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Created {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order information */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Pickup Date</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {new Date(order.pickupDate).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Pickup Slot</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {order.pickupTimeSlot}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">{priceLabel}</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            ₹{displayPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Payment</p>

          <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
            {order.paymentStatus.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>

        <Link
          href={`/orders/${order._id}`}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
