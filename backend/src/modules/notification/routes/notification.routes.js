import { Router } from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { authenticate } from "../../../shared/middlewares/authenticate.js";
const router = Router();
/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
|
| All notification routes require authentication.
|
*/
/**
 * Get my notifications
 *
 * GET /api/v1/notifications
 */
router.get("/", authenticate, notificationController.getMyNotifications);
/**
 * Get unread notifications
 *
 * GET /api/v1/notifications/unread
 */
router.get("/unread", authenticate, notificationController.getUnreadNotifications);
/**
 * Get unread notification count
 *
 * GET /api/v1/notifications/unread-count
 */
router.get("/unread-count", authenticate, notificationController.getUnreadCount);
/**
 * Mark all notifications as read
 *
 * PATCH /api/v1/notifications/read-all
 */
router.patch("/read-all", authenticate, notificationController.markAllAsRead);
/**
 * Get notification by ID
 *
 * GET /api/v1/notifications/:id
 */
router.get("/:id", authenticate, notificationController.getById);
/**
 * Mark notification as read
 *
 * PATCH /api/v1/notifications/:id/read
 */
router.patch("/:id/read", authenticate, notificationController.markAsRead);
/**
 * Delete notification
 *
 * DELETE /api/v1/notifications/:id
 */
router.delete("/:id", authenticate, notificationController.delete);
export default router;
//# sourceMappingURL=notification.routes.js.map