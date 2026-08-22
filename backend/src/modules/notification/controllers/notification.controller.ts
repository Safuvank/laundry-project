import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { notificationService } from "../services/notification.service.js";

class NotificationController {
  /* -------------------------------------------------------------------------- */
  /*                         GET MY NOTIFICATIONS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all notifications for the logged-in user
   *
   * GET /api/v1/notifications
   */
  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notifications = await notificationService.getMyNotifications(userId);

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                        GET UNREAD NOTIFICATIONS                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Get unread notifications
   *
   * GET /api/v1/notifications/unread
   */
  getUnreadNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notifications =
      await notificationService.getUnreadNotifications(userId);

    return res.status(200).json({
      success: true,
      message: "Unread notifications retrieved successfully.",
      data: notifications,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           GET UNREAD COUNT                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Get unread notification count
   *
   * GET /api/v1/notifications/unread-count
   */
  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const count = await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      message: "Unread notification count retrieved successfully.",
      data: {
        count,
      },
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                              GET BY ID                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Get notification by ID
   *
   * GET /api/v1/notifications/:id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notificationId = req.params.id;

    if (!notificationId || Array.isArray(notificationId)) {
      throw new ValidationError("Invalid notification id.");
    }

    const notification = await notificationService.getById(
      notificationId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Notification retrieved successfully.",
      data: notification,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                             MARK AS READ                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark notification as read
   *
   * PATCH /api/v1/notifications/:id/read
   */
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notificationId = req.params.id;

    if (!notificationId || Array.isArray(notificationId)) {
      throw new ValidationError("Invalid notification id.");
    }

    const notification = await notificationService.markAsRead(
      notificationId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                          MARK ALL AS READ                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark all notifications as read
   *
   * PATCH /api/v1/notifications/read-all
   */
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Delete notification
   *
   * DELETE /api/v1/notifications/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notificationId = req.params.id;

    if (!notificationId || Array.isArray(notificationId)) {
      throw new ValidationError("Invalid notification id.");
    }

    await notificationService.delete(notificationId, userId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  });
}

export const notificationController = new NotificationController();
