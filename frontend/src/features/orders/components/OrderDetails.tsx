"use client";

import Link from "next/link";
import { useState } from "react";

import { useOrder } from "../hooks/useOrder";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import PriceApprovalCard from "./PriceApprovalCard";

import { usePaymentByOrder } from "@/features/payments/hooks/usePaymentByOrder";
import { useCreatePayment } from "@/features/payments/hooks/useCreatePayment";
import { useInitiatePayment } from "@/features/payments/hooks/useInitiatePayment";

import PaymentSummary from "@/features/payments/components/PaymentSummary";
import PaymentMethodSelector from "@/features/payments/components/PaymentMethodSelector";
import PaymentButton from "@/features/payments/components/PaymentButton";
import PaymentStatus from "@/features/payments/components/PaymentStatus";

import type { PaymentMethod } from "@/features/payments/types/payment.type";

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrder(orderId);

  const {
    data: payment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = usePaymentByOrder(orderId);

  const createPaymentMutation = useCreatePayment();
  const initiatePaymentMutation = useInitiatePayment();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-slate-200" />

            <div className="mt-3 h-9 w-64 rounded bg-slate-200" />

            <div className="mt-8 h-48 rounded-2xl bg-white" />

            <div className="mt-6 h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-600">
              Order Details
            </p>

            <h1 className="mt-1 text-2xl font-bold text-red-900">
              Unable to load this order
            </h1>

            <p className="mt-2 text-sm text-red-700">
              The order could not be retrieved. It may not exist or you may not
              have access to it.
            </p>

            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-red-100 p-4 text-xs text-red-800">
                {error instanceof Error ? error.message : "Unknown error"}
              </pre>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

              <Link
                href="/orders"
                className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Payment is available only when:
   *
   * 1. Final price exists
   * 2. Final price is greater than zero
   * 3. Customer has already approved the price
   * 4. Payment has not already been completed/refunded
   */
  const canPay =
    order.finalPrice !== undefined &&
    order.finalPrice > 0 &&
    order.status !== "CUSTOMER_APPROVAL_PENDING" &&
    order.status !== "ON_HOLD" &&
    order.paymentStatus !== "PAID" &&
    order.paymentStatus !== "REFUNDED";

  const finalPrice = order.finalPrice ?? 0;

  const isPaymentCreating = createPaymentMutation.isPending;
  const isPaymentInitiating = initiatePaymentMutation.isPending;

  const handlePay = () => {
    if (!canPay || !order.finalPrice) {
      return;
    }

    /*
     * If a payment already exists, don't create another one.
     * Instead initiate the existing pending payment.
     */
    if (payment) {
      if (payment.status === "PENDING") {
        initiatePaymentMutation.mutate(payment._id);
      }

      return;
    }

    /*
     * IMPORTANT:
     * Do NOT send amount.
     *
     * Backend calculates the amount from order.finalPrice.
     */
    createPaymentMutation.mutate(
      {
        orderId: order._id,
        paymentMethod,
      },
      {
        onSuccess: (createdPayment) => {
          initiatePaymentMutation.mutate(createdPayment._id);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Header */}
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Order Details
              </p>

              <h1 className="mt-1 break-all text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                #{order._id}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Created {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <OrderStatusBadge status={order.status} size="md" />
          </div>
        </header>

        {/* Background refresh indicator */}
        {isFetching && (
          <p className="mt-3 text-right text-xs font-medium text-slate-400">
            Updating order...
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Order Timeline */}
            <OrderTimeline currentStatus={order.status} />

            {/* Customer Price Approval */}
            {order.status === "CUSTOMER_APPROVAL_PENDING" &&
              order.finalPrice !== undefined && (
                <PriceApprovalCard
                  orderId={order._id}
                  finalPrice={order.finalPrice}
                />
              )}

            {/* Order Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">
                Order Information
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Laundry & Pickup
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Pickup Date"
                  value={new Date(order.pickupDate).toLocaleDateString()}
                />

                <InfoItem
                  label="Pickup Time"
                  value={order.pickupTimeSlot}
                />

                <InfoItem
                  label="Detergent"
                  value={order.detergentPreference || "Not specified"}
                />

                <InfoItem
                  label="Fabric Softener"
                  value={order.fabricSoftener ? "Yes" : "No"}
                />

                <InfoItem
                  label="Starch"
                  value={order.starchPreference ? "Yes" : "No"}
                />

                <InfoItem
                  label="Folding"
                  value={order.foldingPreference || "Not specified"}
                />
              </div>

              {order.customerNotes && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Customer Notes
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {order.customerNotes}
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            {/* Pricing */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Pricing</p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Order Amount
              </h2>

              <div className="mt-6 space-y-4">
                <InfoItem
                  label="Estimated Price"
                  value={`₹${order.estimatedPrice.toFixed(2)}`}
                />

                <InfoItem
                  label="Final Price"
                  value={
                    order.finalPrice !== undefined
                      ? `₹${order.finalPrice.toFixed(2)}`
                      : "Not finalized"
                  }
                />

                <InfoItem
                  label="Pricing Status"
                  value={order.pricingStatus
                    .replaceAll("_", " ")
                    .toLowerCase()}
                />
              </div>

              {/* Customer approval required */}
              {order.status === "CUSTOMER_APPROVAL_PENDING" && (
                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-orange-800">
                    Customer approval required
                  </p>

                  <p className="mt-1 text-xs text-orange-700">
                    Please review the final price and choose Approve Price or
                    Reject Price.
                  </p>
                </div>
              )}

              {/* Price approved */}
              {order.status === "PROCESSING" && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    Price approved
                  </p>

                  <p className="mt-1 text-xs text-green-700">
                    Your final price has been approved and the order is now
                    being processed.
                  </p>
                </div>
              )}

              {/* Price rejected */}
              {order.status === "ON_HOLD" && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    Order on hold
                  </p>

                  <p className="mt-1 text-xs text-red-700">
                    The final price was rejected. Please wait for further
                    action.
                  </p>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Payment</p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Payment Status
              </h2>

              <div className="mt-6">
                <InfoItem
                  label="Order Payment Status"
                  value={order.paymentStatus
                    .replaceAll("_", " ")
                    .toLowerCase()}
                />
              </div>
            </section>

            {/* Existing payment */}
            {payment && (
              <div className="space-y-4">
                <PaymentStatus
                  status={payment.status}
                  failureReason={payment.failureReason}
                />

                <PaymentSummary payment={payment} />

                {/* Pending payment */}
                {payment.status === "PENDING" && canPay && (
                  <>
                    <PaymentMethodSelector
                      value={payment.paymentMethod || paymentMethod}
                      onChange={setPaymentMethod}
                      disabled={
                        isPaymentCreating || isPaymentInitiating
                      }
                    />

                    <PaymentButton
                      amount={payment.amount}
                      paymentMethod={
                        payment.paymentMethod || paymentMethod
                      }
                      isCreating={isPaymentCreating}
                      isProcessing={isPaymentInitiating}
                      onPay={handlePay}
                    />
                  </>
                )}

                {/* Failed payment */}
                {payment.status === "FAILED" && canPay && (
                  <>
                    <PaymentMethodSelector
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      disabled={
                        isPaymentCreating || isPaymentInitiating
                      }
                    />

                    <PaymentButton
                      amount={payment.amount}
                      paymentMethod={
                        payment.paymentMethod || paymentMethod
                      }
                      isCreating={isPaymentCreating}
                      isProcessing={isPaymentInitiating}
                      onPay={handlePay}
                    />
                  </>
                )}
              </div>
            )}

            {/* No payment yet */}
            {!payment && !isPaymentLoading && canPay && (
              <div className="space-y-4">
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  disabled={
                    isPaymentCreating || isPaymentInitiating
                  }
                />

                <PaymentButton
                  amount={finalPrice}
                  paymentMethod={paymentMethod}
                  isCreating={isPaymentCreating}
                  isProcessing={isPaymentInitiating}
                  onPay={handlePay}
                />
              </div>
            )}

            {/* Payment loading */}
            {isPaymentLoading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Loading payment information...
                </p>
              </div>
            )}

            {/* Payment error */}
            {isPaymentError && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm font-medium text-yellow-800">
                  No payment has been created for this order yet.
                </p>
              </div>
            )}

            {/* Payment unavailable */}
            {!canPay && !payment && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  {order.status === "CUSTOMER_APPROVAL_PENDING"
                    ? "Payment will be available after you approve the final price."
                    : order.status === "ON_HOLD"
                      ? "Payment is unavailable while this order is on hold."
                      : order.paymentStatus === "PAID"
                        ? "This order has already been paid."
                        : order.paymentStatus === "REFUNDED"
                          ? "This order payment has been refunded."
                          : "Payment will be available once the order has a valid final price."}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}