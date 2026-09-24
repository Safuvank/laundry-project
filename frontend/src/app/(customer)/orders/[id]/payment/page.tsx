"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PaymentMethodSelector from "@/features/payments/components/PaymentMethodSelector";
import PaymentSummary from "@/features/payments/components/PaymentSummary";
import RazorpayCheckout from "@/features/payments/components/RazorpayCheckout";

import {
  createPayment,
  getPaymentByOrderId,
} from "@/features/payments/api/payments.api";

import type {
  Payment,
  PaymentMethod,
} from "@/features/payments/types/payment.type";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id as string;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  const [payment, setPayment] = useState<Payment | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /*                         LOAD PAYMENT                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadPayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const existingPayment = await getPaymentByOrderId(orderId);

        setPayment(existingPayment);

        if (existingPayment.paymentMethod) {
          setPaymentMethod(existingPayment.paymentMethod);
        }
      } catch (error) {
        /*
         * If the order does not have a payment yet,
         * we will create it when the customer clicks Pay.
         */
        console.error("Unable to load payment:", error);

        setPayment(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayment();
  }, [orderId]);

  /* ------------------------------------------------------------------------ */
  /*                         CREATE PAYMENT                                   */
  /* ------------------------------------------------------------------------ */

  const handleCreatePayment = async () => {
    if (!orderId) {
      setError("Order ID is missing.");
      return;
    }

    try {
      setError(null);
      setIsCreatingPayment(true);

      const newPayment = await createPayment({
        orderId,
        paymentMethod,
      });

      setPayment(newPayment);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create payment.";

      setError(message);
    } finally {
      setIsCreatingPayment(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              LOADING                                     */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading payment...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                               UI                                         */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {payment && <PaymentSummary payment={payment} />}

      {!payment && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Complete Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Select your payment method and continue to Razorpay Checkout.
          </p>
        </div>
      )}

      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
        disabled={isCreatingPayment}
      />

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!payment && (
        <button
          type="button"
          onClick={handleCreatePayment}
          disabled={isCreatingPayment || !paymentMethod}
          className="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreatingPayment ? "Creating payment..." : "Continue to Payment"}
        </button>
      )}

      {payment && payment.status !== "SUCCESS" && (
        <RazorpayCheckout
          paymentId={payment._id}
          onSuccess={() => {
            setError(null);

            router.push(`/orders/${orderId}`);
          }}
          onError={(message) => {
            setError(message);
          }}
        />
      )}

      {payment?.status === "SUCCESS" && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          <p className="font-semibold">Payment successful</p>

          <p className="mt-1">Your payment has been successfully completed.</p>
        </div>
      )}
    </div>
  );
}
