"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import OrderCard from "@/features/orders/components/OrderCard";

import { useCustomerOrders } from "@/features/orders/hooks/useCustomerOrders";
import type { Order } from "@/features/orders/types/order.types";
import { OrderStatus } from "@/lib/constants/order-status";

type OrderFilter = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const isActiveOrder = (order: Order) => {
  return (
    order.isActive &&
    order.status !== OrderStatus.COMPLETED &&
    order.status !== OrderStatus.CANCELLED
  );
};

const filterOrders = (orders: Order[], filter: OrderFilter) => {
  switch (filter) {
    case "ACTIVE":
      return orders.filter(isActiveOrder);

    case "COMPLETED":
      return orders.filter((order) => order.status === OrderStatus.COMPLETED);

    case "CANCELLED":
      return orders.filter((order) => order.status === OrderStatus.CANCELLED);

    default:
      return orders;
  }
};

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCustomerOrders();

  const [filter, setFilter] = useState<OrderFilter>("ALL");

  const filteredOrders = useMemo(
    () => filterOrders(orders, filter),
    [orders, filter],
  );

  const filters: {
    label: string;
    value: OrderFilter;
    count: number;
  }[] = [
    {
      label: "All Orders",
      value: "ALL",
      count: orders.length,
    },
    {
      label: "Active",
      value: "ACTIVE",
      count: orders.filter(isActiveOrder).length,
    },
    {
      label: "Completed",
      value: "COMPLETED",
      count: orders.filter((order) => order.status === OrderStatus.COMPLETED)
        .length,
    },
    {
      label: "Cancelled",
      value: "CANCELLED",
      count: orders.filter((order) => order.status === OrderStatus.CANCELLED)
        .length,
    },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-slate-200" />

            <div className="mt-3 h-9 w-48 rounded bg-slate-200" />

            <div className="mt-3 h-5 w-80 max-w-full rounded bg-slate-200" />

            <div className="mt-8 h-12 rounded-xl bg-slate-200" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-600">My Orders</p>

            <h1 className="mt-1 text-2xl font-bold text-red-900">
              Unable to load your orders
            </h1>

            <p className="mt-2 text-sm text-red-700">
              Something went wrong while retrieving your orders.
            </p>

            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-red-100 p-4 text-xs text-red-800">
                {error instanceof Error ? error.message : "Unknown error"}
              </pre>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Customer Orders</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track your laundry orders from pickup through delivery.
            </p>
          </div>

          <Link
            href="/orders/new"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create New Order
          </Link>
        </header>

        {/* Filters */}
        <section className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            {filters.map((item) => {
              const isSelected = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}

                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      isSelected
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Refresh indicator */}
        {isFetching && !isLoading && (
          <p className="mt-4 text-right text-xs font-medium text-slate-400">
            Updating orders...
          </p>
        )}

        {/* Orders */}
        <section className="mt-6">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                🧺
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {filter === "ALL"
                  ? "No orders yet"
                  : `No ${filter.toLowerCase()} orders`}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {filter === "ALL"
                  ? "Create your first laundry order and schedule a convenient pickup."
                  : "Orders matching this filter will appear here."}
              </p>

              {filter === "ALL" && (
                <Link
                  href="/orders/new"
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create Your First Order
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
