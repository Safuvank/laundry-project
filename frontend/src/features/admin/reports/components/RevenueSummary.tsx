import type {
  AdminOverviewReport,
  AdminRevenueStatistics,
} from "../types/admin-report.types";

interface RevenueSummaryProps {
  overview: AdminOverviewReport;
  revenue: AdminRevenueStatistics;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  valueClassName?: string;
}

function SummaryCard({
  title,
  value,
  description,
  valueClassName = "text-slate-950",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-600">
        {title}
      </p>

      <p
        className={`mt-3 text-2xl font-bold tracking-tight ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function RevenueSummary({
  overview,
  revenue,
}: RevenueSummaryProps) {
  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* Revenue Cards */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(revenue.totalRevenue)}
          description="Total successful payment revenue"
          valueClassName="text-emerald-600"
        />

        <SummaryCard
          title="Net Revenue"
          value={formatCurrency(revenue.netRevenue)}
          description="Revenue after refunds"
          valueClassName="text-blue-600"
        />

        <SummaryCard
          title="Refunded"
          value={formatCurrency(revenue.refundedAmount)}
          description="Total refunded amount"
          valueClassName="text-violet-600"
        />

        <SummaryCard
          title="Total Orders"
          value={overview.orders.total}
          description="All orders in the system"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Order Summary */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Active Orders"
          value={overview.orders.active}
          description="Orders currently in progress"
          valueClassName="text-blue-600"
        />

        <SummaryCard
          title="Completed Orders"
          value={overview.orders.completed}
          description="Successfully completed orders"
          valueClassName="text-emerald-600"
        />

        <SummaryCard
          title="Cancelled Orders"
          value={overview.orders.cancelled}
          description="Orders that were cancelled"
          valueClassName="text-red-600"
        />

        <SummaryCard
          title="Paid Revenue"
          value={formatCurrency(overview.revenue.paid)}
          description="Paid payment amount"
          valueClassName="text-emerald-600"
        />
      </div>
    </div>
  );
}
