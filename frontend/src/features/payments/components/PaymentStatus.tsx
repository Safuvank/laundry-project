"use client";

import type { PaymentStatus as PaymentStatusType } from "../types/payment.type";

interface PaymentStatusProps {
  status: PaymentStatusType;
  failureReason?: string;
}

const statusConfig: Record<
  PaymentStatusType,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Payment Pending",
    description: "Payment has been created and is waiting to be initiated.",
    className: "bg-yellow-50 text-yellow-700",
  },

  INITIATED: {
    label: "Payment Initiated",
    description: "Payment has been initiated and is awaiting completion.",
    className: "bg-blue-50 text-blue-700",
  },

  SUCCESS: {
    label: "Payment Successful",
    description: "Your payment was completed successfully.",
    className: "bg-green-50 text-green-700",
  },

  FAILED: {
    label: "Payment Failed",
    description: "The payment could not be completed.",
    className: "bg-red-50 text-red-700",
  },

  REFUNDED: {
    label: "Payment Refunded",
    description: "This payment has been refunded.",
    className: "bg-purple-50 text-purple-700",
  },
};

export default function PaymentStatus({
  status,
  failureReason,
}: PaymentStatusProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
        Payment status: {status}
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 ${config.className}`}>
      <p className="font-semibold">{config.label}</p>

      <p className="mt-1 text-sm opacity-90">{config.description}</p>

      {status === "FAILED" && failureReason && (
        <p className="mt-2 text-sm font-medium">Reason: {failureReason}</p>
      )}
    </div>
  );
}
