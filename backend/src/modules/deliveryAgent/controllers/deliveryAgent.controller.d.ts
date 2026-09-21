declare class DeliveryAgentController {
    /**
     * Create delivery agent
     *
     * Admin only.
     *
     * This creates:
     *
     * 1. User account
     * 2. DeliveryAgent profile
     *
     * POST /api/v1/delivery-agents
     */
    create: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get logged-in delivery agent profile
     *
     * Delivery Agent only.
     */
    getMyProfile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get delivery agent by ID
     *
     * Admin only.
     */
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get all delivery agents
     *
     * Admin only.
     */
    getAll: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get all active delivery agents
     *
     * Admin only.
     */
    getAllActive: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get all available delivery agents
     *
     * Admin only.
     */
    getAvailableAgents: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update delivery agent status
     *
     * Delivery Agent only.
     */
    updateStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update delivery agent current location
     *
     * Delivery Agent only.
     */
    updateLocation: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Find available agents near a location
     *
     * Admin / Internal system.
     *
     * Default radius = 5 km.
     */
    findNearbyAgents: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update delivery agent profile
     *
     * Admin only.
     */
    update: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Activate delivery agent
     *
     * Admin only.
     */
    activate: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Deactivate delivery agent
     *
     * Admin only.
     */
    deactivate: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const deliveryAgentController: DeliveryAgentController;
export {};
//# sourceMappingURL=deliveryAgent.controller.d.ts.map