"use client";

import type { PaymentStatus } from "../types/admin-payment.types";

interface AdminPaymentFiltersProps {
  search: string;
  status: PaymentStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PaymentStatus | "") => void;
}

export default function AdminPaymentFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: AdminPaymentFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm md:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search customer or order ID..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:flex-1"
      />

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as PaymentStatus | "")
        }
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
    </div>
  );
}
