"use client";

import type { PaymentMethod } from "../types/payment.type";

interface PaymentButtonProps {
  amount: number;
  paymentMethod: PaymentMethod;
  isCreating?: boolean;
  isInitiating?: boolean;
  disabled?: boolean;
  onPay: () => void;
}

export default function PaymentButton({
  amount,
  paymentMethod,
  isCreating = false,
  isInitiating = false,
  disabled = false,
  onPay,
}: PaymentButtonProps) {
  const isProcessing = isCreating || isInitiating;

  return (
    <button
      type="button"
      disabled={disabled || isProcessing || !paymentMethod}
      onClick={onPay}
      className="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isCreating
        ? "Creating payment..."
        : isInitiating
          ? "Starting payment..."
          : `Pay ₹${amount.toFixed(2)}`}
    </button>
  );
}
