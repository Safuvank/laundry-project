import { api } from "@/lib/api/axios";

import type {
  AdminPayment,
  AdminPaymentListQuery,
  AdminPaymentsResponse,
} from "../types/admin-payment.types";

export const getAdminPayments = async (
  query?: AdminPaymentListQuery,
): Promise<AdminPaymentsResponse> => {
  const response = await api.get("/admin/payments", {
    params: query,
  });

  return response.data.data;
};

export const getAdminPaymentById = async (
  paymentId: string,
): Promise<AdminPayment> => {
  const response = await api.get(`/admin/payments/${paymentId}`);

  return response.data.data;
};