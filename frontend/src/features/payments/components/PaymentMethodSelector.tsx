"use client";

import type { PaymentMethod } from "../types/payment.type";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const paymentMethods: {
  value: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "UPI",
    label: "UPI",
    description: "Pay using your UPI app",
  },
  {
    value: "CARD",
    label: "Card",
    description: "Pay using debit or credit card",
  },
];

export default function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>

        <p className="mt-1 text-sm text-gray-500">
          Select how you want to pay.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {paymentMethods.map((method) => {
          const selected = value === method.value;

          return (
            <button
              key={method.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(method.value)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              } ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full border ${
                    selected ? "border-gray-900" : "border-gray-400"
                  }`}
                >
                  {selected && (
                    <div className="h-2 w-2 rounded-full bg-gray-900" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-gray-900">{method.label}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {method.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
