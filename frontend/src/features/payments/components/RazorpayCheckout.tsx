"use client";

import { useState } from "react";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/payments.api";

interface RazorpayCheckoutProps {
  paymentId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close?: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  handler: (response: RazorpayResponse) => void;

  modal?: {
    ondismiss?: () => void;
  };

  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export default function RazorpayCheckout({
  paymentId,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      /* -------------------------------------------------------------------- */
      /*                     LOAD RAZORPAY CHECKOUT                           */
      /* -------------------------------------------------------------------- */

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again.",
        );
      }

      /* -------------------------------------------------------------------- */
      /*                       RAZORPAY KEY                                   */
      /* -------------------------------------------------------------------- */

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error(
          "Razorpay key is not configured.",
        );
      }

      /* -------------------------------------------------------------------- */
      /*                    CREATE RAZORPAY ORDER                             */
      /* -------------------------------------------------------------------- */

      const razorpayOrder = await createRazorpayOrder(paymentId);

      if (!razorpayOrder.gatewayOrderId) {
        throw new Error(
          "Razorpay order ID was not returned by the server.",
        );
      }

      if (!razorpayOrder.amountInPaise) {
        throw new Error(
          "Invalid Razorpay payment amount.",
        );
      }

      /* -------------------------------------------------------------------- */
      /*                      RAZORPAY CHECKOUT                               */
      /* -------------------------------------------------------------------- */

      const options: RazorpayOptions = {
        key: keyId,

        amount: razorpayOrder.amountInPaise,

        currency: razorpayOrder.currency,

        name: "FreshFold",

        description: "FreshFold Laundry Payment",

        order_id: razorpayOrder.gatewayOrderId,

        handler: async (response) => {
          try {
            setIsLoading(true);

            /* -------------------------------------------------------------- */
            /*                  VERIFY PAYMENT ON SERVER                      */
            /* -------------------------------------------------------------- */

            await verifyRazorpayPayment(paymentId, {
              razorpayPaymentId: response.razorpay_payment_id,

              razorpayOrderId: response.razorpay_order_id,

              razorpaySignature: response.razorpay_signature,
            });

            setIsLoading(false);

            onSuccess?.();
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Payment verification failed.";

            setIsLoading(false);

            onError?.(message);
          }
        },

        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start payment.";

      setIsLoading(false);

      onError?.(message);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading
        ? "Processing payment..."
        : "Pay Now"}
    </button>
  );
}