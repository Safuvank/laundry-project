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
/*                         CREATE FRESHFOLD PAYMENT                           */
/* -------------------------------------------------------------------------- */

/**
 * Create a FreshFold payment record.
 *
 * POST /api/v1/payments
 *
 * The backend gets the payment amount from order.finalPrice.
 */
export const createPayment = async (
  payload: CreatePaymentPayload,
): Promise<Payment> => {
  const response = await api.post<PaymentResponse>("/payments", payload);

  return response.data.data;
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

  const response = await api.get<PaymentResponse>(`/payments/${paymentId}`);

  return response.data.data;
};

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

  const response = await api.get<PaymentResponse>(`/payments/order/${orderId}`);

  return response.data.data;
};

/**
 * Get all payments belonging to the logged-in customer.
 *
 * GET /api/v1/payments/my-payments
 */
export const getMyPayments = async (): Promise<Payment[]> => {
  const response = await api.get<PaymentsResponse>("/payments/my-payments");

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                         RAZORPAY PAYMENT FLOW                             */
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
 * The frontend does NOT send the amount.
 *
 * Backend:
 * FreshFold Payment
 *       ↓
 * order.finalPrice
 *       ↓
 * Razorpay Order
 */
export const createRazorpayOrder = async (
  paymentId: string,
): Promise<CreateRazorpayOrderData> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await api.post<CreateRazorpayOrderResponse>(
    `/payments/${paymentId}/razorpay-order`,
  );

  return response.data.data;
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
 * The frontend sends the values returned by Razorpay Checkout.
 *
 * Backend verifies:
 * - payment ownership
 * - payment status
 * - Razorpay order ID
 * - Razorpay signature
 *
 * Then:
 * Payment → SUCCESS
 * Order.paymentStatus → PAID
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

  const response = await api.post<VerifyRazorpayPaymentResponse>(
    `/payments/${paymentId}/verify`,
    payload,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                         LEGACY / MANUAL FLOW                              */
/* -------------------------------------------------------------------------- */

/**
 * Initiate payment.
 *
 * PATCH /api/v1/payments/:id/initiate
 *
 * Kept for the existing/manual payment flow.
 *
 * Razorpay should use:
 * createRazorpayOrder()
 */
export const initiatePayment = async (paymentId: string): Promise<Payment> => {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/initiate`,
  );

  return response.data.data;
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

  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/success`,
    payload,
  );

  return response.data.data;
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

  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/fail`,
    payload,
  );

  return response.data.data;
};
