import type { AdminOrderStatistics } from "../types/admin-report.types";

interface OrderStatisticsProps {
  statistics: AdminOrderStatistics;
}

interface StatisticCardProps {
  title: string;
  value: number;
  description: string;
  valueClassName?: string;
}

function StatisticCard({
  title,
  value,
  description,
  valueClassName = "text-slate-950",
}: StatisticCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>

      <p className={`mt-3 text-2xl font-bold tracking-tight ${valueClassName}`}>
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "BOOKED":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "PICKUP_ASSIGNED":
    case "DELIVERY_ASSIGNED":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";

    case "OUT_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      return "bg-amber-100 text-amber-800 border-amber-200";

    case "PICKED_UP":
    case "RECEIVED_AT_FACILITY":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";

    case "INSPECTION_IN_PROGRESS":
    case "QUALITY_CHECK":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "PRICE_FINALIZED":
    case "CUSTOMER_APPROVAL_PENDING":
      return "bg-orange-100 text-orange-800 border-orange-200";

    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "READY_FOR_DELIVERY":
      return "bg-teal-100 text-teal-800 border-teal-200";

    case "DELIVERED":
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";

    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";

    case "PICKUP_FAILED":
    case "DELIVERY_FAILED":
      return "bg-red-100 text-red-800 border-red-200";

    case "ON_HOLD":
      return "bg-slate-100 text-slate-800 border-slate-200";

    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export default function OrderStatistics({ statistics }: OrderStatisticsProps) {
  const statusBreakdown = statistics.statusBreakdown ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* -------------------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------------------- */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Order Statistics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of order volume and current status.
        </p>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* KPI Cards */}
      {/* -------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatisticCard
          title="Total Orders"
          value={statistics.totalOrders}
          description="All orders"
        />

        <StatisticCard
          title="Active Orders"
          value={statistics.activeOrders}
          description="Currently active"
          valueClassName="text-blue-600"
        />

        <StatisticCard
          title="Completed"
          value={statistics.completedOrders}
          description="Successfully completed"
          valueClassName="text-emerald-600"
        />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Cancelled */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-800">Cancelled Orders</p>

            <p className="mt-1 text-xs text-red-600">
              Orders that were cancelled.
            </p>
          </div>

          <p className="text-2xl font-bold text-red-700">
            {statistics.cancelledOrders}
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Status Breakdown */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Status Breakdown
          </h3>

          <span className="text-xs text-slate-500">
            {statusBreakdown.length} statuses
          </span>
        </div>

        {statusBreakdown.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-500">
              No order status data available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      item.status,
                    )}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>

                <span className="ml-4 text-sm font-semibold text-slate-950">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
