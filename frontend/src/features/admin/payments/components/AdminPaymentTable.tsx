"use client";

import Link from "next/link";

import type { AdminPayment } from "../types/admin-payment.types";
import AdminPaymentStatusBadge from "./AdminPaymentStatusBadge";

interface AdminPaymentTableProps {
  payments: AdminPayment[];
}

export default function AdminPaymentTable({
  payments,
}: AdminPaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-slate-600">No payments found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-sm">
      <table className="min-w-full text-sm text-slate-900">
        <thead className="border-b border-slate-300 bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Payment ID
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Customer
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Order ID
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Amount
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Method
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-800">
              Status
            </th>

            <th className="px-4 py-3 text-right font-semibold text-slate-800">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => {
            const customerName = payment.userId
              ? `${payment.userId.firstName} ${payment.userId.lastName}`
              : "Unknown user";

            return (
              <tr
                key={payment._id}
                className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-4 py-4">
                  <span className="font-mono text-xs text-slate-700">
                    {payment._id.slice(-8)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {customerName}
                    </p>

                    <p className="text-xs text-slate-600">
                      {payment.userId?.email ?? "No email"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="font-mono text-xs text-slate-700">
                    {payment.orderId?._id.slice(-8) ?? "—"}
                  </span>
                </td>

                <td className="px-4 py-4 font-medium text-slate-900">
                  ₹{payment.amount.toFixed(2)}
                </td>

                <td className="px-4 py-4 text-slate-800">
                  {payment.paymentMethod}
                </td>

                <td className="px-4 py-4">
                  <AdminPaymentStatusBadge
                    status={payment.status}
                  />
                </td>

                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/payments/${payment._id}`}
                    className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
