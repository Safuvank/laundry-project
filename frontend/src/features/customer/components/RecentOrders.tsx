"use client";

import Link from "next/link";
import type { Order } from "@/features/orders/types/order.types";

interface RecentOrdersProps {
  orders: Order[];
}

function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Recent Orders
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
            Your order history
          </h2>
        </div>

        {orders.length > 0 && (
          <Link
            href="/orders"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {/* Empty State */}
      {recentOrders.length === 0 ? (
        <div className="mt-6 rounded-xl bg-gray-50 px-4 py-8 text-center ring-1 ring-inset ring-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            No orders yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your recent laundry orders will appear here.
          </p>
          <Link
            href="/orders/new"
            className="mt-4 inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create an Order
          </Link>
        </div>
      ) : (
        /* Orders */
        <div className="mt-6 divide-y divide-gray-100">
          {recentOrders.map((order) => {
            const displayPrice = order.finalPrice ?? order.estimatedPrice;
            const priceLabel = order.finalPrice !== undefined ? "Final" : "Estimated";
            const formattedStatus = order.status.replaceAll("_", " ").toLowerCase();

            return (
              <div
                key={order._id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Order Information */}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    Order #{order._id}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Order Status / Price / Action */}
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{displayPrice.toFixed(2)}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {priceLabel}
                    </p>
                    <p className="mt-1 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {formattedStatus}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order._id}`}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentOrders;