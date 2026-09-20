"use client";

import { useMemo, useState } from "react";

import {
  useAdminOverviewReport,
  useAdminOrderStatistics,
  useAdminRevenueStatistics,
  useAdminPaymentStatistics,
} from "../hooks/useAdminReports";

import RevenueSummary from "./RevenueSummary";
import OrderStatistics from "./OrderStatistics";
import PaymentStatistics from "./PaymentStatistics";
import OrderStatusChart from "./OrderStatusChart";
import ReportDateFilter from "./ReportDateFilter";

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reportDateRange = useMemo(
    () => ({
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }),
    [startDate, endDate],
  );

  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
  } = useAdminOverviewReport();

  const {
    data: orderStatistics,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useAdminOrderStatistics();

  const {
    data: revenueStatistics,
    isLoading: isRevenueLoading,
    isError: isRevenueError,
    error: revenueError,
  } = useAdminRevenueStatistics(reportDateRange);

  const {
    data: paymentStatistics,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    error: paymentsError,
  } = useAdminPaymentStatistics(reportDateRange);

  const isLoading =
    isOverviewLoading ||
    isOrdersLoading ||
    isRevenueLoading ||
    isPaymentsLoading;

  const hasError =
    isOverviewError ||
    isOrdersError ||
    isRevenueError ||
    isPaymentsError;

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mb-6 h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (hasError) {
    const errorMessage =
      overviewError instanceof Error
        ? overviewError.message
        : ordersError instanceof Error
          ? ordersError.message
          : revenueError instanceof Error
            ? revenueError.message
            : paymentsError instanceof Error
              ? paymentsError.message
              : "Failed to load reports.";

    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load reports
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {errorMessage}
            </p>

            <p className="mt-3 text-sm text-red-600">
              Please check your admin authentication and
              backend report endpoints.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (
    !overview ||
    !orderStatistics ||
    !revenueStatistics ||
    !paymentStatistics
  ) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">
              No report data is available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* ------------------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------------------ */}

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Reports
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Monitor orders, revenue, payments, users, and
            delivery operations.
          </p>
        </header>

        {/* ------------------------------------------------------------ */}
        {/* Date Filter */}
        {/* ------------------------------------------------------------ */}

        <section className="mb-8">
          <ReportDateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={clearDateFilter}
          />
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Revenue Summary */}
        {/* ------------------------------------------------------------ */}

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">
            Overview
          </h2>

          <RevenueSummary
            overview={overview}
            revenue={revenueStatistics}
          />
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Orders + Payments */}
        {/* ------------------------------------------------------------ */}

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <OrderStatistics
            statistics={orderStatistics}
          />

          <PaymentStatistics
            statistics={paymentStatistics}
          />
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Order Status Chart */}
        {/* ------------------------------------------------------------ */}

        <section className="mb-8">
          <OrderStatusChart
            statistics={orderStatistics}
          />
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Operations */}
        {/* ------------------------------------------------------------ */}

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">
            Operations
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Users */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">
                Users
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {overview.users.total}
                  </p>

                  <p className="text-xs text-slate-500">
                    Total Users
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {overview.users.active}
                  </p>

                  <p className="text-xs text-slate-500">
                    Active
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-amber-600">
                    {overview.users.suspended}
                  </p>

                  <p className="text-xs text-slate-500">
                    Suspended
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {overview.users.blocked}
                  </p>

                  <p className="text-xs text-slate-500">
                    Blocked
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Agents */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">
                Delivery Agents
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {overview.deliveryAgents.total}
                  </p>

                  <p className="text-xs text-slate-500">
                    Total Agents
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {overview.deliveryAgents.available}
                  </p>

                  <p className="text-xs text-slate-500">
                    Available
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-amber-600">
                    {overview.deliveryAgents.busy}
                  </p>

                  <p className="text-xs text-slate-500">
                    Busy
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {overview.deliveryAgents.active}
                  </p>

                  <p className="text-xs text-slate-500">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
