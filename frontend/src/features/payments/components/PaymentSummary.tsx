"use client";

import type { Payment } from "../types/payment.type";

interface PaymentSummaryProps {
  payment: Payment;
}

export default function PaymentSummary({ payment }: PaymentSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Payment Amount</p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            ₹{payment.amount.toFixed(2)}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Payment ID</p>

          <p className="mt-1 max-w-[180px] truncate text-xs text-gray-600">
            {payment._id}
          </p>
        </div>
      </div>

      {payment.paymentMethod && (
        <div className="mt-5 border-t pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Payment Method
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {payment.paymentMethod}
          </p>
        </div>
      )}
    </div>
  );
}
