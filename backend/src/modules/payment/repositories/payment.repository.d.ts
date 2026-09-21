import { Types, type ClientSession } from "mongoose";
import type { IPayment } from "../interfaces/IPayment.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
import { PaymentMethod } from "../constants/paymentMethod.js";
declare class PaymentRepository {
    /**
     * Create payment
     */
    create(data: Partial<IPayment>, session?: ClientSession): Promise<IPayment>;
    /**
     * Find payment by ID
     */
    findById(id: string | Types.ObjectId, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Find payment by ID with populated references
     *
     * Password is excluded from the populated user.
     */
    findByIdPopulated(id: string | Types.ObjectId): Promise<IPayment | null>;
    /**
     * Find payment for an order
     */
    findByOrderId(orderId: string | Types.ObjectId, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Find payment for an order with populated references
     */
    findByOrderIdPopulated(orderId: string | Types.ObjectId): Promise<IPayment | null>;
    /**
     * Find all payments belonging to a user
     *
     * Newest payments first.
     */
    findByUserId(userId: string | Types.ObjectId): Promise<IPayment[]>;
    /**
     * Find all payments belonging to a user
     * with populated order information.
     */
    findByUserIdPopulated(userId: string | Types.ObjectId): Promise<IPayment[]>;
    /**
     * Find payments by status
     */
    findByStatus(status: PaymentStatus): Promise<IPayment[]>;
    /**
     * Find all payments
     *
     * Admin use.
     */
    findAll(): Promise<IPayment[]>;
    /**
     * Update payment
     */
    update(id: string | Types.ObjectId, data: Partial<IPayment>, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Update payment status
     */
    updateStatus(id: string | Types.ObjectId, status: PaymentStatus, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Mark payment as successful
     */
    markAsSuccess(id: string | Types.ObjectId, transactionId: string, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Mark payment as failed
     */
    markAsFailed(id: string | Types.ObjectId, failureReason: string, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Mark payment as refunded
     */
    markAsRefunded(id: string | Types.ObjectId, refundId: string, refundReason: string, session?: ClientSession): Promise<IPayment | null>;
    /**
     * Reset a failed payment so the customer
     * can attempt the payment again.
     */
    resetForRetry(id: string | Types.ObjectId, amount: number, paymentMethod: PaymentMethod, session?: ClientSession): Promise<IPayment | null>;
}
export declare const paymentRepository: PaymentRepository;
export {};
//# sourceMappingURL=payment.repository.d.ts.map