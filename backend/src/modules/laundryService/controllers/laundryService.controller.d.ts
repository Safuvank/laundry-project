declare class LaundryServiceController {
    /**
     * Create Laundry Service
     * Admin only
     */
    create: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get Active Laundry Services
     * Customer / Public
     */
    getActiveServices: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get All Laundry Services
     * Admin only
     */
    getAll: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get Laundry Service By ID
     */
    getById: import("express").RequestHandler<{
        id: string;
    }, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Update Laundry Service
     * Admin only
     */
    update: import("express").RequestHandler<{
        id: string;
    }, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Activate Laundry Service
     * Admin only
     */
    activate: import("express").RequestHandler<{
        id: string;
    }, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Deactivate Laundry Service
     * Admin only
     */
    deactivate: import("express").RequestHandler<{
        id: string;
    }, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const laundryServiceController: LaundryServiceController;
export {};
//# sourceMappingURL=laundryService.controller.d.ts.map