"use client";

import { useEffect, useRef, useState } from "react";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/payments.api";

interface RazorpayCheckoutProps {
  paymentId: string;
  autoOpen?: boolean;
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

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

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
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export default function RazorpayCheckout({
  paymentId,
  autoOpen = true,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (!paymentId || !autoOpen) {
      return;
    }

    if (hasOpenedRef.current) {
      return;
    }

    hasOpenedRef.current = true;

    void handlePayment();
  }, [paymentId, autoOpen]);

  const handlePayment = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      /*
       * ---------------------------------------------------------------
       * LOAD RAZORPAY CHECKOUT
       * ---------------------------------------------------------------
       */

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again.",
        );
      }

      /*
       * ---------------------------------------------------------------
       * RAZORPAY KEY
       * ---------------------------------------------------------------
       */

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error("Razorpay key is not configured.");
      }

      /*
       * ---------------------------------------------------------------
       * CREATE RAZORPAY ORDER
       * ---------------------------------------------------------------
       *
       * This calls:
       *
       * POST /payments/:paymentId/razorpay-order
       *
       * The backend creates the Razorpay order and returns:
       *
       * gatewayOrderId
       * amountInPaise
       * currency
       */

      const razorpayOrder = await createRazorpayOrder(paymentId);

      if (!razorpayOrder.gatewayOrderId) {
        throw new Error("Razorpay order ID was not returned by the server.");
      }

      if (!razorpayOrder.amountInPaise || razorpayOrder.amountInPaise <= 0) {
        throw new Error("Invalid Razorpay payment amount.");
      }

      /*
       * ---------------------------------------------------------------
       * RAZORPAY CHECKOUT OPTIONS
       * ---------------------------------------------------------------
       */

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

            /*
             * ---------------------------------------------------------
             * VERIFY PAYMENT ON BACKEND
             * ---------------------------------------------------------
             */

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

      /*
       * ---------------------------------------------------------------
       * OPEN RAZORPAY
       * ---------------------------------------------------------------
       */

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start payment.";

      setIsLoading(false);

      onError?.(message);
    }
  };

  /*
   * This component does not render a second Pay button.
   *
   * OrderDetails already has the main:
   *
   * Pay ₹75
   *
   * button.
   *
   * RazorpayCheckout only handles the Razorpay process.
   */

  return null;
}
