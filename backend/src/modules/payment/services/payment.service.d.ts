import { PaymentMethod } from "../constants/paymentMethod.js";
export declare class PaymentService {
    /**
     * Safely converts either:
     *
     * - MongoDB ObjectId
     * - populated Mongoose document
     *
     * into a string ObjectId.
     */
    private getObjectIdString;
    createPayment(data: {
        orderId: string;
        paymentMethod: PaymentMethod;
    }, userId: string): Promise<import("../interfaces/IPayment.js").IPayment | null>;
    getById(paymentId: string, userId: string): Promise<import("../interfaces/IPayment.js").IPayment>;
    getByOrderId(orderId: string, userId: string): Promise<import("../interfaces/IPayment.js").IPayment>;
    getMyPayments(userId: string): Promise<import("../interfaces/IPayment.js").IPayment[]>;
    initiatePayment(paymentId: string, userId: string): Promise<import("../interfaces/IPayment.js").IPayment>;
    /**
     * Payment:
     *
     * INITIATED → SUCCESS
     *
     * Order:
     *
     * paymentStatus → PAID
     */
    markPaymentSuccess(paymentId: string, transactionId: string): Promise<undefined>;
    markPaymentFailed(paymentId: string, failureReason: string): Promise<undefined>;
    refundPayment(paymentId: string, refundId: string, refundReason: string): Promise<undefined>;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map