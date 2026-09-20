"use client";

import { useState } from "react";
import { useStartOrderQualityCheck } from "../../hooks/useStartOrderQualityCheck";
import { useCompleteOrderQualityCheck } from "../../hooks/useCompleteOrderQualityCheck";

interface OrderProcessingActionsProps {
  orderId: string;
  status: string;
}

const OrderProcessingActions = ({
  orderId,
  status,
}: OrderProcessingActionsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const startQualityCheckMutation = useStartOrderQualityCheck();
  const completeQualityCheckMutation = useCompleteOrderQualityCheck();

  const isStartingQualityCheck = startQualityCheckMutation.isPending;
  const isCompletingQualityCheck = completeQualityCheckMutation.isPending;

  const isPending =
    isStartingQualityCheck || isCompletingQualityCheck;

  const handleStartQualityCheck = async () => {
    try {
      await startQualityCheckMutation.mutateAsync(orderId);
      setShowConfirm(false);
    } catch {
      // Error is handled through the mutation state.
    }
  };

  const handleCompleteQualityCheck = async () => {
    try {
      await completeQualityCheckMutation.mutateAsync(orderId);
      setShowConfirm(false);
    } catch {
      // Error is handled through the mutation state.
    }
  };

  // --------------------------------------------------
  // PROCESSING
  // --------------------------------------------------

  if (status === "PROCESSING") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-900">
            Quality Check
          </h3>

          <p className="mt-1 text-sm text-blue-700">
            The order is currently being processed and is ready
            to enter quality check.
          </p>
        </div>

        {startQualityCheckMutation.isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {startQualityCheckMutation.error instanceof Error
              ? startQualityCheckMutation.error.message
              : "Failed to start quality check."}
          </div>
        )}

        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Quality Check
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-white p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to start the quality check
              for this order?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartQualityCheck}
                disabled={isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStartingQualityCheck
                  ? "Starting..."
                  : "Yes, Start"}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------
  // QUALITY CHECK
  // --------------------------------------------------

  if (status === "QUALITY_CHECK") {
    return (
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-cyan-900">
            Quality Check In Progress
          </h3>

          <p className="mt-1 text-sm text-cyan-700">
            Complete the quality check once the order has been
            inspected and approved for delivery.
          </p>
        </div>

        {completeQualityCheckMutation.isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {completeQualityCheckMutation.error instanceof Error
              ? completeQualityCheckMutation.error.message
              : "Failed to complete quality check."}
          </div>
        )}

        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete Quality Check
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-cyan-200 bg-white p-4">
            <p className="text-sm text-gray-700">
              Confirm that the quality check has been completed
              for this order.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCompleteQualityCheck}
                disabled={isPending}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompletingQualityCheck
                  ? "Completing..."
                  : "Yes, Complete"}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------
  // OTHER STATUSES
  // --------------------------------------------------

  return null;
};

export default OrderProcessingActions;
