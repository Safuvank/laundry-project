import type {
  AdminPaymentStatistics,
  PaymentStatus,
} from "../types/admin-report.types";

interface PaymentStatisticsProps {
  statistics: AdminPaymentStatistics;
}

interface PaymentStatusConfig {
  label: string;
  badgeClassName: string;
  amountClassName: string;
}

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  PENDING: {
    label: "Pending",
    badgeClassName: "border-amber-200 bg-amber-100 text-amber-800",
    amountClassName: "text-amber-700",
  },

  PAID: {
    label: "Paid",
    badgeClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
    amountClassName: "text-emerald-700",
  },

  FAILED: {
    label: "Failed",
    badgeClassName: "border-red-200 bg-red-100 text-red-800",
    amountClassName: "text-red-700",
  },

  REFUNDED: {
    label: "Refunded",
    badgeClassName: "border-violet-200 bg-violet-100 text-violet-800",
    amountClassName: "text-violet-700",
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PaymentStatistics({
  statistics,
}: PaymentStatisticsProps) {
  const statusBreakdown = statistics.statusBreakdown ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* -------------------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------------------- */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Payment Statistics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of payment volume, amounts, and status.
        </p>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Summary */}
      {/* -------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-600">Total Payments</p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {statistics.totalPayments}
          </p>

          <p className="mt-1 text-xs text-slate-500">All payment records</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-600">Total Amount</p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {formatCurrency(statistics.totalAmount)}
          </p>

          <p className="mt-1 text-xs text-slate-500">Total payment amount</p>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Status Breakdown */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Payment Status
          </h3>

          <span className="text-xs text-slate-500">
            {statusBreakdown.length} statuses
          </span>
        </div>

        {statusBreakdown.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-500">
              No payment status data available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {statusBreakdown.map((item) => {
              const config = PAYMENT_STATUS_CONFIG[item.status];

              return (
                <div
                  key={item.status}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Status */}

                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        config?.badgeClassName ??
                        "border-slate-200 bg-slate-100 text-slate-800"
                      }`}
                    >
                      {config?.label ?? item.status}
                    </span>

                    {/* Count */}

                    <span className="text-sm font-semibold text-slate-950">
                      {item.count}
                    </span>
                  </div>

                  {/* Amount */}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Amount</span>

                    <span
                      className={`text-sm font-semibold ${
                        config?.amountClassName ?? "text-slate-700"
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
