declare class NotificationController {
    /**
     * Get all notifications for the logged-in user
     *
     * GET /api/v1/notifications
     */
    getMyNotifications: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get unread notifications
     *
     * GET /api/v1/notifications/unread
     */
    getUnreadNotifications: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get unread notification count
     *
     * GET /api/v1/notifications/unread-count
     */
    getUnreadCount: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get notification by ID
     *
     * GET /api/v1/notifications/:id
     */
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Mark notification as read
     *
     * PATCH /api/v1/notifications/:id/read
     */
    markAsRead: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Mark all notifications as read
     *
     * PATCH /api/v1/notifications/read-all
     */
    markAllAsRead: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Delete notification
     *
     * DELETE /api/v1/notifications/:id
     */
    delete: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const notificationController: NotificationController;
export {};
//# sourceMappingURL=notification.controller.d.ts.map