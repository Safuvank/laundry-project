import { Types } from "mongoose";

import type { INotification } from "../interfaces/INotification.js";

import { NotificationType } from "../constants/notificationType.js";

import { notificationRepository } from "../repostitories/notification.repository.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

interface CreateNotificationData {
  userId: string;

  type: NotificationType;

  title: string;

  message: string;

  orderId?: string;
}

class NotificationService {
  /* -------------------------------------------------------------------------- */
  /*                              PRIVATE HELPERS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(id: string, fieldName: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError(`Invalid ${fieldName}.`);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a notification
   */
  async create(data: CreateNotificationData): Promise<INotification> {
    this.validateObjectId(data.userId, "user id");

    if (data.orderId !== undefined) {
      this.validateObjectId(data.orderId, "order id");
    }

    if (!data.title.trim()) {
      throw new ValidationError("Notification title is required.");
    }

    if (!data.message.trim()) {
      throw new ValidationError("Notification message is required.");
    }

    const notification = await notificationRepository.create({
      userId: new Types.ObjectId(data.userId),

      type: data.type,

      title: data.title.trim(),

      message: data.message.trim(),

      ...(data.orderId !== undefined && {
        orderId: new Types.ObjectId(data.orderId),
      }),

      isRead: false,
    });

    return notification;
  }

  /* -------------------------------------------------------------------------- */
  /*                              GET BY ID                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Get notification by ID
   *
   * A user can only access their own notification.
   */
  async getById(
    notificationId: string,
    userId: string,
  ): Promise<INotification> {
    this.validateObjectId(notificationId, "notification id");

    this.validateObjectId(userId, "user id");

    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundError("Notification not found.");
    }

    /*
     * Verify notification ownership.
     */
    if (notification.userId.toString() !== userId) {
      throw new ValidationError("Notification does not belong to this user.");
    }

    return notification;
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET MY NOTIFICATIONS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all notifications for a user
   */
  async getMyNotifications(userId: string): Promise<INotification[]> {
    this.validateObjectId(userId, "user id");

    return notificationRepository.findByUserId(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                        GET UNREAD NOTIFICATIONS                            */
  /* -------------------------------------------------------------------------- */

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    this.validateObjectId(userId, "user id");

    return notificationRepository.findUnreadByUserId(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                           COUNT UNREAD                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Get unread notification count
   *
   * Useful for notification badge.
   */
  async getUnreadCount(userId: string): Promise<number> {
    this.validateObjectId(userId, "user id");

    return notificationRepository.countUnreadByUserId(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                             MARK AS READ                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark one notification as read
   *
   * The repository also verifies ownership.
   */
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<INotification> {
    this.validateObjectId(notificationId, "notification id");

    this.validateObjectId(userId, "user id");

    const notification = await notificationRepository.markAsRead(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new NotFoundError("Notification not found.");
    }

    return notification;
  }

  /* -------------------------------------------------------------------------- */
  /*                          MARK ALL AS READ                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    this.validateObjectId(userId, "user id");

    await notificationRepository.markAllAsRead(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Delete notification
   *
   * The repository also verifies ownership.
   */
  async delete(notificationId: string, userId: string): Promise<void> {
    this.validateObjectId(notificationId, "notification id");

    this.validateObjectId(userId, "user id");

    const deleted = await notificationRepository.delete(notificationId, userId);

    if (!deleted) {
      throw new NotFoundError("Notification not found.");
    }
  }
}

export const notificationService = new NotificationService();
