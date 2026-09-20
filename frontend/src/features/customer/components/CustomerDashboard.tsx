"use client";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import CurrentOrder from "./CurrentOrder";
import QuickActions from "./QuickActions";
import RecentOrders from "./RecentOrders";

import { useCustomerOrders } from "@/features/orders/hooks/useCustomerOrders";

export default function CustomerDashboard() {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useCustomerOrders();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardHeader />

          <section className="mt-8 rounded-2xl bg-white p-10 shadow-sm ring-1 ring-gray-200">
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-blue-600" />
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Loading your orders...
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardHeader />

          <section className="mt-8 rounded-2xl bg-red-50 p-6 ring-1 ring-red-200">
            <h2 className="text-lg font-semibold text-red-800">
              Unable to load orders
            </h2>

            <p className="mt-2 text-sm text-red-600">
              We couldn't retrieve your orders. Please try again later.
            </p>

            {/* Development-only error information */}
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-red-100 p-4 text-xs text-red-800">
                {error instanceof Error ? error.message : "Unknown error"}
              </pre>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader />
        <DashboardStats orders={orders} />

        <div className="mt-8">
          <CurrentOrder orders={orders} />
        </div>

        <div className="mt-8">
          <QuickActions />
        </div>

        <div className="mt-8">
          <RecentOrders orders={orders} />
        </div>
      </div>
    </main>
  );
}