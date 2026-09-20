"use client";

import { useState } from "react";

import { useAdminPayments } from "../hooks/useAdminPayments";
import type { PaymentStatus } from "../types/admin-payment.types";

import AdminPaymentFilters from "./AdminPaymentFilters";
import AdminPaymentTable from "./AdminPaymentTable";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<PaymentStatus | "">("");

  const query = {
    page,
    limit: 10,
    ...(search.trim() && {
      search: search.trim(),
    }),
    ...(status && {
      status,
    }),
  };

  const { data, isLoading, isError, error } =
    useAdminPayments(query);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: PaymentStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p className="text-slate-700">
          Loading payments...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p className="text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load payments."}
        </p>
      </div>
    );
  }

  const payments = data?.payments ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          Payments
        </h1>

        <p className="text-sm text-slate-600">
          Manage and monitor customer payments.
        </p>
      </div>

      <AdminPaymentFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      <AdminPaymentTable payments={payments} />

      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
