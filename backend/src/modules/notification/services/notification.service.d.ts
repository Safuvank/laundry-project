import type { INotification } from "../interfaces/INotification.js";
import { NotificationType } from "../constants/notificationType.js";
interface CreateNotificationData {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    orderId?: string;
}
declare class NotificationService {
    /**
     * Validate MongoDB ObjectId
     */
    private validateObjectId;
    /**
     * Create a notification
     */
    create(data: CreateNotificationData): Promise<INotification>;
    /**
     * Get notification by ID
     *
     * A user can only access their own notification.
     */
    getById(notificationId: string, userId: string): Promise<INotification>;
    /**
     * Get all notifications for a user
     */
    getMyNotifications(userId: string): Promise<INotification[]>;
    /**
     * Get unread notifications for a user
     */
    getUnreadNotifications(userId: string): Promise<INotification[]>;
    /**
     * Get unread notification count
     *
     * Useful for notification badge.
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Mark one notification as read
     *
     * The repository also verifies ownership.
     */
    markAsRead(notificationId: string, userId: string): Promise<INotification>;
    /**
     * Mark all notifications as read
     */
    markAllAsRead(userId: string): Promise<void>;
    /**
     * Delete notification
     *
     * The repository also verifies ownership.
     */
    delete(notificationId: string, userId: string): Promise<void>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map