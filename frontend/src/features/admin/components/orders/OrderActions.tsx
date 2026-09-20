"use client";

import { useState } from "react";

import { useReceiveOrderAtFacility } from "../../hooks/useReceiveOrderAtFacility";
import { useStartOrderInspection } from "../../hooks/useStartOrderInspection";
import { useUpdateOrderPricing } from "../../hooks/useUpdateOrderPricing";
import { useRequestCustomerApproval } from "../../hooks/useRequestCustomerApproval";

interface OrderActionsProps {
  orderId: string;
  status: string;
  estimatedPrice?: number;
  finalPrice?: number;
}

const formatCurrency = (price?: number) => {
  if (price === undefined || !Number.isFinite(price)) {
    return "—";
  }

  return `₹${price.toFixed(2)}`;
};

const OrderActions = ({
  orderId,
  status,
  estimatedPrice,
  finalPrice,
}: OrderActionsProps) => {
  const [showReceiveConfirmation, setShowReceiveConfirmation] = useState(false);

  const [showPricingModal, setShowPricingModal] = useState(false);

  const [finalPriceInput, setFinalPriceInput] = useState("");

  const receiveAtFacilityMutation = useReceiveOrderAtFacility();
  const startInspectionMutation = useStartOrderInspection();
  const updatePricingMutation = useUpdateOrderPricing();
  const requestApprovalMutation = useRequestCustomerApproval();

  /*
   * ------------------------------------------------------------------------
   * Receive at Facility
   * ------------------------------------------------------------------------
   */

  const handleReceiveAtFacility = () => {
    receiveAtFacilityMutation.mutate(orderId, {
      onSuccess: () => {
        setShowReceiveConfirmation(false);
      },
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Start Inspection
   * ------------------------------------------------------------------------
   */

  const handleStartInspection = () => {
    startInspectionMutation.mutate(orderId);
  };

  /*
   * ------------------------------------------------------------------------
   * Finalize Price
   * ------------------------------------------------------------------------
   */

  const handleOpenPricingModal = () => {
    setFinalPriceInput(
      estimatedPrice !== undefined ? String(estimatedPrice) : "",
    );

    setShowPricingModal(true);
  };

  const handleFinalizePrice = () => {
    const price = Number(finalPriceInput);

    if (!Number.isFinite(price) || price < 0) {
      return;
    }

    updatePricingMutation.mutate(
      {
        orderId,
        finalPrice: price,
      },
      {
        onSuccess: () => {
          setShowPricingModal(false);
          setFinalPriceInput("");
        },
      },
    );
  };

  /*
   * ------------------------------------------------------------------------
   * Request Customer Approval
   * ------------------------------------------------------------------------
   */

  const handleRequestCustomerApproval = () => {
    requestApprovalMutation.mutate(orderId);
  };

  /*
   * ------------------------------------------------------------------------
   * PICKED_UP
   * ------------------------------------------------------------------------
   */

  if (status === "PICKED_UP") {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowReceiveConfirmation(true)}
          disabled={receiveAtFacilityMutation.isPending}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {receiveAtFacilityMutation.isPending
            ? "Receiving..."
            : "Receive at Facility"}
        </button>

        {showReceiveConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                Receive Order at Facility
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Are you sure this order has been received at the FreshFold
                facility?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReceiveConfirmation(false)}
                  disabled={receiveAtFacilityMutation.isPending}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReceiveAtFacility}
                  disabled={receiveAtFacilityMutation.isPending}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {receiveAtFacilityMutation.isPending
                    ? "Receiving..."
                    : "Confirm Receive"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * RECEIVED_AT_FACILITY
   * ------------------------------------------------------------------------
   */

  if (status === "RECEIVED_AT_FACILITY") {
    return (
      <button
        type="button"
        onClick={handleStartInspection}
        disabled={startInspectionMutation.isPending}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {startInspectionMutation.isPending
          ? "Starting Inspection..."
          : "Start Inspection"}
      </button>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * INSPECTION_IN_PROGRESS
   * ------------------------------------------------------------------------
   */

  if (status === "INSPECTION_IN_PROGRESS") {
    return (
      <>
        <div className="w-full space-y-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-semibold text-yellow-800">
              Inspection in Progress
            </p>

            <p className="mt-1 text-sm text-yellow-700">
              Inspect the order and verify the actual items, quantity,
              condition, stains, and required services before finalizing the
              price.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Estimated Price
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatCurrency(estimatedPrice)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenPricingModal}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Finalize Price
              </button>
            </div>
          </div>
        </div>

        {showPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                Finalize Order Price
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Enter the final price after completing the inspection.
              </p>

              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estimated Price</span>

                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(estimatedPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="final-price"
                  className="text-sm font-medium text-gray-700"
                >
                  Final Price
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    ₹
                  </span>

                  <input
                    id="final-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalPriceInput}
                    onChange={(event) => setFinalPriceInput(event.target.value)}
                    placeholder="Enter final price"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>

              {finalPriceInput.trim() !== "" &&
                Number.isFinite(Number(finalPriceInput)) && (
                  <div className="mt-4 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Estimated Price</span>

                      <span className="font-medium text-gray-900">
                        {formatCurrency(estimatedPrice)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Final Price</span>

                      <span className="font-semibold text-gray-900">
                        {formatCurrency(Number(finalPriceInput))}
                      </span>
                    </div>

                    {estimatedPrice !== undefined && (
                      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                        <span className="text-gray-500">Difference</span>

                        <span className="font-semibold text-gray-900">
                          {formatCurrency(
                            Number(finalPriceInput) - estimatedPrice,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              <p className="mt-3 text-xs text-gray-500">
                This final price will be sent to the customer for approval.
              </p>

              {updatePricingMutation.isError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-600">
                    Failed to finalize the price. Please try again.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPricingModal(false);
                    setFinalPriceInput("");
                  }}
                  disabled={updatePricingMutation.isPending}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFinalizePrice}
                  disabled={
                    updatePricingMutation.isPending ||
                    finalPriceInput.trim() === ""
                  }
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatePricingMutation.isPending
                    ? "Finalizing..."
                    : "Finalize Price"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * PRICE_FINALIZED
   * ------------------------------------------------------------------------
   */

  if (status === "PRICE_FINALIZED") {
    return (
      <div className="w-full space-y-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-800">Price Finalized</p>

          <p className="mt-1 text-sm text-blue-700">
            The final price has been calculated. Send the price to the customer
            for approval before starting the laundry process.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Estimated Price
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(estimatedPrice)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Final Price
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(finalPrice)}
              </p>
            </div>
          </div>

          {estimatedPrice !== undefined && finalPrice !== undefined && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price Difference</span>

                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(finalPrice - estimatedPrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleRequestCustomerApproval}
          disabled={requestApprovalMutation.isPending}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {requestApprovalMutation.isPending
            ? "Sending..."
            : "Request Customer Approval"}
        </button>

        {requestApprovalMutation.isError && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-600">
              Failed to request customer approval. Please try again.
            </p>
          </div>
        )}
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * CUSTOMER_APPROVAL_PENDING
   * ------------------------------------------------------------------------
   */

  if (status === "CUSTOMER_APPROVAL_PENDING") {
    return (
      <div className="w-full space-y-4">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-800">
            Waiting for Customer Approval
          </p>

          <p className="mt-1 text-sm text-orange-700">
            The final price has been sent to the customer. Waiting for the
            customer to approve the price.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Estimated Price
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(estimatedPrice)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Final Price
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatCurrency(finalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Other statuses
   * ------------------------------------------------------------------------
   */

  return null;
};

export default OrderActions;
