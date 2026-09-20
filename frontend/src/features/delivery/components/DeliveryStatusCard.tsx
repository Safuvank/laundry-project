"use client";

import { useState } from "react";

function DeliveryStatusCard() {
  const [isAvailable, setIsAvailable] = useState(false);

  const handleToggleStatus = () => {
    setIsAvailable((current) => !current);
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Status
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Control whether you are available to receive new assignments.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              isAvailable ? "bg-green-500" : "bg-gray-400"
            }`}
          />

          <span
            className={`text-sm font-semibold ${
              isAvailable ? "text-green-700" : "text-gray-600"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isAvailable
                ? "You are available"
                : "You are currently unavailable"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {isAvailable
                ? "You can receive new pickup and delivery assignments."
                : "You will not receive new assignments while unavailable."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleStatus}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
              isAvailable ? "bg-green-600" : "bg-gray-300"
            }`}
            aria-pressed={isAvailable}
            aria-label="Toggle delivery availability"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                isAvailable
                  ? "translate-x-5"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
