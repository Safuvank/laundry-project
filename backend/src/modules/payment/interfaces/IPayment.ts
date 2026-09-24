import { Types } from "mongoose";

import { PaymentStatus } from "../constants/paymentStatus.js";
import { PaymentMethod } from "../constants/paymentMethod.js";

export interface IPayment {
  _id?: Types.ObjectId;

  orderId: Types.ObjectId;
  userId: Types.ObjectId;

  amount: number;

  status: PaymentStatus;

  paymentMethod?: PaymentMethod;

  /**
   * Gateway payment/transaction ID
   *
   * Example:
   * Razorpay payment ID
   */
  transactionId?: string;

  /**
   * Gateway order ID
   *
   * Example:
   * Razorpay order ID
   */
  gatewayOrderId?: string;

  /**
   * Gateway payment signature
   *
   * Used to verify the payment response.
   */
  gatewaySignature?: string;

  paidAt?: Date;

  failureReason?: string;

  refundId?: string;

  refundReason?: string;

  refundedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
