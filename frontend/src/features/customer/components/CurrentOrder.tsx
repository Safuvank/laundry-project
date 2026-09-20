"use client";

import type { Order } from "@/features/orders/types/order.types";
import { OrderStatus } from "@/lib/constants/order-status";

interface CurrentOrderProps {
  orders: Order[];
}

const CurrentOrder = ({ orders }: CurrentOrderProps) => {
  const activeOrders = orders.filter(
    (order) =>
      order.isActive &&
      order.status !== OrderStatus.COMPLETED &&
      order.status !== OrderStatus.CANCELLED,
  );

  const currentOrder = [...activeOrders].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];

  if (!currentOrder) {
    return (
      <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Current Order
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
            No active order
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any active laundry orders at the moment.
          </p>
        </div>
      </section>
    );
  }

  const displayPrice = currentOrder.finalPrice ?? currentOrder.estimatedPrice;
  const priceLabel = currentOrder.finalPrice !== undefined ? "Final Price" : "Estimated Price";
  const formattedStatus = currentOrder.status.replaceAll("_", " ").toLowerCase();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Current Order
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
            Order #{currentOrder._id}
          </h2>
        </div>

        <span className="w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {formattedStatus}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Status */}
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-100/50">
          <p className="text-xs font-medium text-gray-500">Status</p>
          <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
            {formattedStatus}
          </p>
        </div>

        {/* Price */}
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-100/50">
          <p className="text-xs font-medium text-gray-500">{priceLabel}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            ₹{displayPrice.toFixed(2)}
          </p>
        </div>

        {/* Pickup */}
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-100/50">
          <p className="text-xs font-medium text-gray-500">Pickup</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {new Date(currentOrder.pickupDate).toLocaleDateString()}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {currentOrder.pickupTimeSlot}
          </p>
        </div>
      </div>

      {/* Order Information */}
      <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500">Payment Status</p>
          <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
            {currentOrder.paymentStatus.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">Pricing Status</p>
          <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
            {currentOrder.pricingStatus.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-5 border-t border-gray-100 pt-5">
        <p className="text-xs font-medium text-gray-500">Last updated</p>
        <p className="mt-1 text-xs font-medium text-gray-900">
          {new Date(currentOrder.updatedAt).toLocaleString()}
        </p>
      </div>
    </section>
  );
};

export default CurrentOrder;