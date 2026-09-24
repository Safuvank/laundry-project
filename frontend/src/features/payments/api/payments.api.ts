import { api } from "@/lib/api/axios";

import type {
  CreatePaymentPayload,
  MarkPaymentFailedPayload,
  MarkPaymentSuccessPayload,
  Payment,
  PaymentResponse,
  PaymentsResponse,
} from "../types/payment.type";

/* -------------------------------------------------------------------------- */
/*                              RESPONSE TYPES                               */
/* -------------------------------------------------------------------------- */

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

/* -------------------------------------------------------------------------- */
/*                         CREATE FRESHFOLD PAYMENT                           */
/* -------------------------------------------------------------------------- */

/**
 * Create a FreshFold payment record.
 *
 * POST /api/v1/payments
 *
 * The backend calculates the payment amount from:
 *
 * Order
 *   ↓
 * order.finalPrice
 *
 * The frontend does NOT send the amount.
 */
export const createPayment = async (
  payload: CreatePaymentPayload,
): Promise<Payment> => {
  if (!payload.orderId) {
    throw new Error("Order ID is required.");
  }

  if (!payload.paymentMethod) {
    throw new Error("Payment method is required.");
  }

  try {
    const response = await api.post<PaymentResponse>("/payments", payload);

    if (!response.data?.data) {
      throw new Error("Payment was created but no payment data was returned.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to create payment.");
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET PAYMENT                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get payment by payment ID.
 *
 * GET /api/v1/payments/:id
 */
export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  try {
    const response = await api.get<PaymentResponse>(`/payments/${paymentId}`);

    if (!response.data?.data) {
      throw new Error("Payment information was not returned.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to retrieve payment.");
  }
};

/* -------------------------------------------------------------------------- */
/*                         GET PAYMENT BY ORDER                               */
/* -------------------------------------------------------------------------- */

/**
 * Get payment by order ID.
 *
 * GET /api/v1/payments/order/:orderId
 */
export const getPaymentByOrderId = async (
  orderId: string,
): Promise<Payment> => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  try {
    const response = await api.get<PaymentResponse>(
      `/payments/order/${orderId}`,
    );

    if (!response.data?.data) {
      throw new Error("Payment information was not returned.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(
      error,
      "Unable to retrieve payment for this order.",
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                         GET MY PAYMENTS                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get all payments belonging to the logged-in customer.
 *
 * GET /api/v1/payments/my-payments
 */
export const getMyPayments = async (): Promise<Payment[]> => {
  try {
    const response = await api.get<PaymentsResponse>("/payments/my-payments");

    return response.data?.data ?? [];
  } catch (error) {
    throw normalizePaymentError(error, "Unable to retrieve payments.");
  }
};

/* -------------------------------------------------------------------------- */
/*                         RAZORPAY PAYMENT FLOW                              */
/* -------------------------------------------------------------------------- */

export interface CreateRazorpayOrderData {
  paymentId: string;
  gatewayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  status: string;
}

export interface CreateRazorpayOrderResponse {
  success: boolean;
  message: string;
  data: CreateRazorpayOrderData;
}

/**
 * Create a Razorpay order for an existing FreshFold payment.
 *
 * POST /api/v1/payments/:id/razorpay-order
 *
 * IMPORTANT:
 *
 * The frontend does NOT send:
 *
 * - amount
 * - currency
 * - Razorpay order ID
 *
 * The backend gets the amount from:
 *
 * FreshFold Payment
 *       ↓
 * Order
 *       ↓
 * order.finalPrice
 *       ↓
 * Razorpay Order
 *
 * Authentication:
 *
 * Axios automatically attaches:
 *
 * Authorization: Bearer <accessToken>
 */
export const createRazorpayOrder = async (
  paymentId: string,
): Promise<CreateRazorpayOrderData> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  try {
    const response = await api.post<CreateRazorpayOrderResponse>(
      `/payments/${paymentId}/razorpay-order`,
    );

    const data = response.data?.data;

    if (!data) {
      throw new Error("Razorpay order was not created.");
    }

    if (!data.gatewayOrderId) {
      throw new Error("Razorpay order ID was not returned by the server.");
    }

    if (!data.amountInPaise || data.amountInPaise <= 0) {
      throw new Error("Invalid Razorpay payment amount.");
    }

    if (!data.currency) {
      throw new Error("Razorpay currency was not returned by the server.");
    }

    return data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to create Razorpay order.");
  }
};

/* -------------------------------------------------------------------------- */
/*                       VERIFY RAZORPAY PAYMENT                             */
/* -------------------------------------------------------------------------- */

export interface VerifyRazorpayPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyRazorpayPaymentData {
  _id: string;
  status: string;
  transactionId?: string;
  gatewayOrderId?: string;
  gatewaySignature?: string;
  paidAt?: string;
}

export interface VerifyRazorpayPaymentResponse {
  success: boolean;
  message: string;
  data: VerifyRazorpayPaymentData;
}

/**
 * Verify a Razorpay payment on the FreshFold backend.
 *
 * POST /api/v1/payments/:id/verify
 *
 * Razorpay Checkout returns:
 *
 * razorpay_payment_id
 * razorpay_order_id
 * razorpay_signature
 *
 * The frontend sends those values to the backend.
 *
 * The backend then verifies:
 *
 * 1. Payment ownership
 * 2. Payment status
 * 3. Razorpay order ID
 * 4. Razorpay signature
 *
 * On success:
 *
 * Payment
 *    ↓
 * SUCCESS
 *
 * Order.paymentStatus
 *    ↓
 * PAID
 */
export const verifyRazorpayPayment = async (
  paymentId: string,
  payload: VerifyRazorpayPaymentPayload,
): Promise<VerifyRazorpayPaymentData> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  if (!payload.razorpayPaymentId) {
    throw new Error("Razorpay payment ID is required.");
  }

  if (!payload.razorpayOrderId) {
    throw new Error("Razorpay order ID is required.");
  }

  if (!payload.razorpaySignature) {
    throw new Error("Razorpay payment signature is required.");
  }

  try {
    const response = await api.post<VerifyRazorpayPaymentResponse>(
      `/payments/${paymentId}/verify`,
      payload,
    );

    const data = response.data?.data;

    if (!data) {
      throw new Error(
        "Payment verification completed but no payment data was returned.",
      );
    }

    return data;
  } catch (error) {
    throw normalizePaymentError(error, "Payment verification failed.");
  }
};

/* -------------------------------------------------------------------------- */
/*                         LEGACY / MANUAL FLOW                              */
/* -------------------------------------------------------------------------- */

/**
 * Initiate payment.
 *
 * PATCH /api/v1/payments/:id/initiate
 *
 * This endpoint is still used by the current
 * FreshFold payment flow before Razorpay Checkout.
 *
 * Flow:
 *
 * FreshFold Payment
 *       ↓
 * initiatePayment()
 *       ↓
 * Razorpay Checkout
 *
 * Razorpay order creation is handled separately by:
 *
 * createRazorpayOrder()
 */
export const initiatePayment = async (paymentId: string): Promise<Payment> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  try {
    const response = await api.patch<PaymentResponse>(
      `/payments/${paymentId}/initiate`,
    );

    if (!response.data?.data) {
      throw new Error("Payment initiation did not return payment data.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to initiate payment.");
  }
};

/* -------------------------------------------------------------------------- */
/*                              ADMIN / TESTING                              */
/* -------------------------------------------------------------------------- */

/**
 * Mark payment as successful.
 *
 * PATCH /api/v1/payments/:id/success
 *
 * ADMIN / DEVELOPMENT TESTING ONLY.
 */
export const markPaymentSuccess = async (
  paymentId: string,
  payload: MarkPaymentSuccessPayload,
): Promise<Payment> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  try {
    const response = await api.patch<PaymentResponse>(
      `/payments/${paymentId}/success`,
      payload,
    );

    if (!response.data?.data) {
      throw new Error("Payment success response did not contain payment data.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to mark payment as successful.");
  }
};

/**
 * Mark payment as failed.
 *
 * PATCH /api/v1/payments/:id/fail
 *
 * ADMIN / DEVELOPMENT TESTING ONLY.
 */
export const markPaymentFailed = async (
  paymentId: string,
  payload: MarkPaymentFailedPayload,
): Promise<Payment> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  try {
    const response = await api.patch<PaymentResponse>(
      `/payments/${paymentId}/fail`,
      payload,
    );

    if (!response.data?.data) {
      throw new Error("Payment failure response did not contain payment data.");
    }

    return response.data.data;
  } catch (error) {
    throw normalizePaymentError(error, "Unable to mark payment as failed.");
  }
};

/* -------------------------------------------------------------------------- */
/*                              ERROR HANDLING                                */
/* -------------------------------------------------------------------------- */

/**
 * Convert Axios/API errors into useful frontend errors.
 *
 * IMPORTANT:
 *
 * Authentication errors are intentionally preserved.
 *
 * Example:
 *
 * Backend:
 * {
 *   success: false,
 *   message: "Access token is missing."
 * }
 *
 * Frontend receives:
 *
 * Error("Access token is missing.")
 *
 * This makes the real backend problem visible
 * instead of hiding it behind a generic message.
 */
const normalizePaymentError = (
  error: unknown,
  fallbackMessage: string,
): Error => {
  if (error instanceof Error) {
    const axiosError = error as typeof error & {
      response?: {
        data?: ApiErrorResponse;
        status?: number;
      };
    };

    const serverMessage = axiosError.response?.data?.message;

    if (serverMessage) {
      return new Error(serverMessage);
    }

    return error;
  }

  return new Error(fallbackMessage);
};
