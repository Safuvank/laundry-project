"use client";

import { useState } from "react";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";

import { useApproveOrderPrice } from "../hooks/useApproveOrderPrice";
import { useRejectOrderPrice } from "../hooks/useRejectOrderPrice";

interface PriceApprovalCardProps {
  orderId: string;
  finalPrice: number;
}

export default function PriceApprovalCard({
  orderId,
  finalPrice,
}: PriceApprovalCardProps) {
  const [showRejectConfirmation, setShowRejectConfirmation] =
    useState(false);

  const approveMutation = useApproveOrderPrice();
  const rejectMutation = useRejectOrderPrice();

  const handleApprove = () => {
    approveMutation.mutate(orderId);
  };

  const handleReject = () => {
    rejectMutation.mutate(orderId);
  };

  const isLoading =
    approveMutation.isPending || rejectMutation.isPending;

  return (
    <>
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Price Approval Required
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Your laundry items have been inspected and the final price
              is ready for your approval.
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Final Price
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            AED {finalPrice.toFixed(2)}
          </p>
        </div>

        {/* Error */}
        {(approveMutation.isError || rejectMutation.isError) && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">
              {approveMutation.error instanceof Error
                ? approveMutation.error.message
                : rejectMutation.error instanceof Error
                  ? rejectMutation.error.message
                  : "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {approveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Approve Price
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowRejectConfirmation(true)}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Reject Price
          </button>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <X className="h-5 w-5 text-red-600" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Reject this price?
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to reject the final price of{" "}
              <span className="font-semibold text-gray-900">
                AED {finalPrice.toFixed(2)}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-gray-500">
              The order will be placed on hold until further action is
              taken.
            </p>

            {rejectMutation.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">
                  {rejectMutation.error instanceof Error
                    ? rejectMutation.error.message
                    : "Unable to reject the price."}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowRejectConfirmation(false)}
                disabled={rejectMutation.isPending}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejectMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rejecting...
                  </span>
                ) : (
                  "Yes, Reject Price"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
