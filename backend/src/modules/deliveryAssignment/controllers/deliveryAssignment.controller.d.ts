declare class DeliveryAssignmentController {
    /**
     * Create delivery assignment manually
     *
     * Admin only
     *
     * Admin provides:
     * - orderId
     * - deliveryAgentId
     * - assignmentType
     */
    create: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Automatically create delivery assignment
     *
     * Admin only
     *
     * Required body:
     * - orderId
     * - latitude
     * - longitude
     *
     * The admin's current location is required
     * when assigning a delivery agent.
     *
     * POST /api/v1/delivery-assignments/delivery
     */
    createDeliveryAssignment: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get delivery assignment by ID
     *
     * Admin
     */
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get assignments for an order
     *
     * Admin
     */
    getByOrderId: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get active assignment for an order
     *
     * Admin
     */
    getActiveByOrderId: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get assignments for delivery agent
     *
     * Admin
     */
    getByAgentId: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get active assignment for delivery agent
     *
     * Admin
     */
    getActiveByAgentId: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Resolve the authenticated User ID to the DeliveryAgent document ID.
     *
     * req.user.userId is the User._id.
     * DeliveryAssignment.deliveryAgentId stores the DeliveryAgent._id.
     */
    private getAuthenticatedDeliveryAgentId;
    /**
     * Get assignments for the authenticated delivery agent
     *
     * Delivery Agent only
     *
     * GET /api/v1/delivery-assignments/me
     *
     * The authenticated User._id is resolved to the
     * DeliveryAgent._id internally.
     */
    getMyAssignments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Accept assignment
     *
     * Delivery Agent
     */
    accept: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Start pickup
     *
     * Delivery Agent
     *
     * Order:
     * PICKUP_ASSIGNED → OUT_FOR_PICKUP
     */
    startPickup: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Start delivery
     *
     * Delivery Agent
     *
     * Order:
     * DELIVERY_ASSIGNED → OUT_FOR_DELIVERY
     */
    startDelivery: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Reject assignment
     *
     * Delivery Agent
     */
    reject: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Complete assignment
     *
     * Delivery Agent
     */
    complete: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Cancel assignment
     *
     * Admin
     */
    cancel: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get all active assignments
     *
     * Admin
     */
    getAllActive: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get assignments by status
     *
     * Admin
     */
    getByStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const deliveryAssignmentController: DeliveryAssignmentController;
export {};
//# sourceMappingURL=deliveryAssignment.controller.d.ts.map