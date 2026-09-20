"use client";

import type { AdminOrderStatistics } from "../types/admin-report.types";

interface OrderStatusChartProps {
  statistics: AdminOrderStatistics;
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function OrderStatusChart({
  statistics,
}: OrderStatusChartProps) {
  const statusBreakdown = statistics.statusBreakdown ?? [];

  if (statusBreakdown.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Orders by Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of orders across the current workflow.
          </p>
        </div>

        <div className="flex min-h-75 items-center justify-center rounded-lg border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">
            No order status data available.
          </p>
        </div>
      </div>
    );
  }

  const chartData = statusBreakdown.map((item) => ({
    status: formatStatus(item.status),
    count: item.count,
  }));

  const maxCount = Math.max(...chartData.map((item) => item.count), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* -------------------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------------------- */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Orders by Status
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of orders across the current workflow.
        </p>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Chart */}
      {/* -------------------------------------------------------------- */}

      <div className="space-y-4">
        {chartData.map((item) => {
          const percentage = (item.count / maxCount) * 100;

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  {item.status}
                </span>

                <span className="text-sm font-semibold text-slate-950">
                  {item.count}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Footer */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-xs text-slate-500">Total orders</span>

        <span className="text-sm font-semibold text-slate-950">
          {statistics.totalOrders}
        </span>
      </div>
    </div>
  );
}
