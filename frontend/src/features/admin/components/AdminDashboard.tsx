"use client";

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  PackageCheck,
  Truck,
  UserCheck,
  XCircle,
} from "lucide-react";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading the dashboard."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const dashboard = data.data;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor FreshFold operations, deliveries, agents, and revenue.
        </p>
      </div>

      {/* Order Statistics */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Orders
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Orders"
            value={dashboard.orders.total}
            icon={<ClipboardList size={22} />}
            description="All active orders"
          />

          <StatCard
            title="Today's Orders"
            value={dashboard.orders.today}
            icon={<Clock3 size={22} />}
            description="Orders created today"
          />

          <StatCard
            title="Pending Orders"
            value={dashboard.orders.pending}
            icon={<PackageCheck size={22} />}
            description="Orders still in progress"
          />

          <StatCard
            title="Completed Orders"
            value={dashboard.orders.completed}
            icon={<CheckCircle2 size={22} />}
            description="Successfully completed"
          />

          <StatCard
            title="Cancelled Orders"
            value={dashboard.orders.cancelled}
            icon={<XCircle size={22} />}
            description="Cancelled orders"
          />
        </div>
      </section>

      {/* Delivery Statistics */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Deliveries & Agents
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Active Pickups"
            value={dashboard.deliveries.activePickups}
            icon={<Truck size={22} />}
            description="Pickup assignments in progress"
          />

          <StatCard
            title="Active Deliveries"
            value={dashboard.deliveries.activeDeliveries}
            icon={<Truck size={22} />}
            description="Delivery assignments in progress"
          />

          <StatCard
            title="Available Agents"
            value={dashboard.agents.available}
            icon={<UserCheck size={22} />}
            description={`Out of ${dashboard.agents.total} active agents`}
          />
        </div>
      </section>

      {/* Revenue */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Revenue
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <StatCard
            title="Total Revenue"
            value={`₹${dashboard.revenue.total.toLocaleString("en-IN")}`}
            icon={<CreditCard size={22} />}
            description="Total successful payments"
          />

          <StatCard
            title="Today's Revenue"
            value={`₹${dashboard.revenue.today.toLocaleString("en-IN")}`}
            icon={<CreditCard size={22} />}
            description="Successful payments today"
          />
        </div>
      </section>
    </div>
  );
}