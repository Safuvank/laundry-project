declare class PaymentController {
    /**
     * Create payment for an order
     *
     * POST /api/v1/payments
     *
     * Body:
     * {
     *   "orderId": "...",
     *   "paymentMethod": "UPI"
     * }
     *
     * IMPORTANT:
     * Amount is NOT accepted from the frontend.
     * PaymentService gets the amount from order.finalPrice.
     */
    createPayment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get payment by ID
     *
     * GET /api/v1/payments/:id
     */
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get payment for an order
     *
     * GET /api/v1/payments/order/:orderId
     */
    getByOrderId: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get all payments belonging to logged-in customer
     *
     * GET /api/v1/payments/my-payments
     */
    getMyPayments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Initiate payment
     *
     * PATCH /api/v1/payments/:id/initiate
     */
    initiatePayment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Mark payment as successful
     *
     * Admin / verified payment flow
     *
     * PATCH /api/v1/payments/:id/success
     */
    markPaymentSuccess: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Mark payment as failed
     *
     * ADMIN ONLY
     *
     * PATCH /api/v1/payments/:id/fail
     */
    markPaymentFailed: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Refund payment
     *
     * ADMIN ONLY
     *
     * PATCH /api/v1/payments/:id/refund
     *
     * Body:
     * {
     *   "refundId": "TEST-REFUND-001",
     *   "refundReason": "Customer requested refund"
     * }
     *
     * IMPORTANT:
     * This endpoint is currently for development/testing.
     * In production, refundId should come from the payment gateway.
     */
    refundPayment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const paymentController: PaymentController;
export {};
//# sourceMappingURL=payment.controller.d.ts.map