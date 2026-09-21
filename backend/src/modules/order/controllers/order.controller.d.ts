declare class OrderController {
    /**
     * Create Order
     *
     * Customer sends:
     * - addressId
     * - turnaroundPlanId
     * - laundryServiceIds
     * - pickupSlotId
     * - pickupLocation
     * - preferences
     *
     * pickupLocation is captured from the customer's
     * browser at booking time.
     *
     * Expected format:
     *
     * {
     *   latitude: number,
     *   longitude: number
     * }
     */
    create: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get My Orders
     */
    getMyOrders: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get Order By ID
     */
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Cancel Order
     */
    cancel: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get All Orders
     */
    getAll: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update Order Status
     *
     * Validates that the received status is one of the
     * supported OrderStatus values before calling the service.
     */
    updateStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Mark Order As Received At Facility
     *
     * PICKED_UP
     *      ↓
     * RECEIVED_AT_FACILITY
     */
    markReceivedAtFacility: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Start Order Inspection
     *
     * RECEIVED_AT_FACILITY
     *          ↓
     * INSPECTION_IN_PROGRESS
     */
    startInspection: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Request Customer Approval
     *
     * PRICE_FINALIZED
     *        ↓
     * CUSTOMER_APPROVAL_PENDING
     */
    requestCustomerApproval: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Approve Final Price
     *
     * Customer only
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *       APPROVE
     *          ↓
     *       PROCESSING
     */
    approvePrice: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Reject Final Price
     *
     * Customer only
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *        REJECT
     *          ↓
     *        ON_HOLD
     */
    rejectPrice: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Start Quality Check
     *
     * PROCESSING
     *      ↓
     * QUALITY_CHECK
     */
    startQualityCheck: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Complete Quality Check
     *
     * QUALITY_CHECK
     *      ↓
     * READY_FOR_DELIVERY
     */
    completeQualityCheck: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Complete Order
     *
     * DELIVERED
     *      ↓
     * COMPLETED
     */
    completeOrder: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update Pricing
     *
     * Body:
     * {
     *   finalPrice: number
     * }
     */
    updatePricing: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update Payment Status
     *
     * Body:
     * {
     *   paymentStatus: PaymentStatus
     * }
     */
    updatePaymentStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const orderController: OrderController;
export {};
//# sourceMappingURL=order.controller.d.ts.map