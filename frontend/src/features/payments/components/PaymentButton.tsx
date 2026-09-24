"use client";

import type { PaymentMethod } from "../types/payment.type";

interface PaymentButtonProps {
  amount: number;
  paymentMethod: PaymentMethod;
  isCreating?: boolean;
  isProcessing?: boolean;
  disabled?: boolean;
  onPay: () => void;
}

export default function PaymentButton({
  amount,
  paymentMethod,
  isCreating = false,
  isProcessing = false,
  disabled = false,
  onPay,
}: PaymentButtonProps) {
  const isPaymentProcessing = isCreating || isProcessing;

  const getButtonText = () => {
    if (isCreating) {
      return "Creating payment...";
    }

    if (isProcessing) {
      return "Processing payment...";
    }

    if (!paymentMethod) {
      return "Select payment method";
    }

    return `Pay ₹${amount.toFixed(2)}`;
  };

  return (
    <button
      type="button"
      onClick={onPay}
      disabled={disabled || isPaymentProcessing || !paymentMethod}
      className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPaymentProcessing && (
        <span
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          aria-hidden="true"
        />
      )}

      {getButtonText()}
    </button>
  );
}
