export type PaymentStatus =
  | "PENDING"
  | "INITIATED"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "UPI" | "CARD" | "CASH" | string;

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  gatewayOrderId?: string;
  paidAt?: string;
  failureReason?: string;
  refundId?: string;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  orderId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
}

export interface MarkPaymentSuccessPayload {
  transactionId: string;
}

export interface MarkPaymentFailedPayload {
  failureReason: string;
}
