import { api } from "@/lib/api/axios";

import type {
  CreatePaymentPayload,
  MarkPaymentFailedPayload,
  MarkPaymentSuccessPayload,
  Payment,
  PaymentResponse,
  PaymentsResponse,
} from "../types/payment.type";

export const createPayment = async (
  payload: CreatePaymentPayload,
): Promise<Payment> => {
  const response = await api.post<PaymentResponse>("/payments", payload);

  return response.data.data;
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  const response = await api.get<PaymentResponse>(`/payments/${paymentId}`);

  return response.data.data;
};

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<Payment> => {
  const response = await api.get<PaymentResponse>(`/payments/order/${orderId}`);

  return response.data.data;
};

export const getMyPayments = async (): Promise<Payment[]> => {
  const response = await api.get<PaymentsResponse>("/payments/my-payments");

  return response.data.data;
};

export const initiatePayment = async (paymentId: string): Promise<Payment> => {
  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/initiate`,
  );

  return response.data.data;
};

export const markPaymentSuccess = async (
  paymentId: string,
  payload: MarkPaymentSuccessPayload,
): Promise<Payment> => {
  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/success`,
    payload,
  );

  return response.data.data;
};

export const markPaymentFailed = async (
  paymentId: string,
  payload: MarkPaymentFailedPayload,
): Promise<Payment> => {
  const response = await api.patch<PaymentResponse>(
    `/payments/${paymentId}/fail`,
    payload,
  );

  return response.data.data;
};
