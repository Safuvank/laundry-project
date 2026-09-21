import { Types } from "mongoose";
import { PaymentStatus } from "../constants/paymentStatus.js";
export interface IPayment {
    _id?: Types.ObjectId;
    /**
     * Order associated with this payment
     */
    orderId: Types.ObjectId;
    /**
     * Customer who made the payment
     */
    userId: Types.ObjectId;
    /**
     * Amount to be paid
     *
     * This should come from Order.finalPrice.
     */
    amount: number;
    /**
     * Current payment status
     */
    status: PaymentStatus;
    /**
     * Payment method used by customer
     *
     * Example:
     * RAZORPAY, CARD, UPI, CASH
     */
    paymentMethod?: string;
    /**
     * Gateway transaction/payment ID
     */
    transactionId?: string;
    /**
     * Gateway order ID
     */
    gatewayOrderId?: string;
    /**
     * When payment was successfully completed
     */
    paidAt?: Date;
    /**
     * Reason when payment fails
     */
    failureReason?: string;
    /**
     * Gateway refund transaction/reference ID
     */
    refundId?: string;
    /**
     * Reason for refund
     */
    refundReason?: string;
    /**
     * When payment was refunded
     */
    refundedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=IPayment.d.ts.map