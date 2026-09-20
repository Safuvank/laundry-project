import type { OrderStatus } from "@/lib/constants/order-status";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = string;

export interface AdminPaymentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
}

export interface AdminPaymentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
}

export interface AdminPaymentOrder {
  _id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface AdminPayment {
  _id: string;
  orderId: AdminPaymentOrder | null;
  userId: AdminPaymentUser | null;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  failedAt?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
