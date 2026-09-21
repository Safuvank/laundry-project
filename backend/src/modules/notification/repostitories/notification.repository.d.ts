import { Types } from "mongoose";
import type { INotification } from "../interfaces/INotification.js";
declare class NotificationRepository {
    /**
     * Create notification
     */
    create(data: Partial<INotification>): Promise<INotification>;
    /**
     * Find notification by ID
     *
     * Password is explicitly excluded from the populated user.
     */
    findById(id: string | Types.ObjectId): Promise<INotification | null>;
    /**
     * Find all notifications for a user
     *
     * Newest notifications first.
     *
     * The query is scoped to the provided userId.
     */
    findByUserId(userId: string | Types.ObjectId): Promise<INotification[]>;
    /**
     * Find unread notifications for a user
     */
    findUnreadByUserId(userId: string | Types.ObjectId): Promise<INotification[]>;
    /**
     * Count unread notifications for a user
     */
    countUnreadByUserId(userId: string | Types.ObjectId): Promise<number>;
    /**
     * Mark one notification as read
     *
     * IMPORTANT:
     * The notification must belong to the given user.
     */
    markAsRead(id: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<INotification | null>;
    /**
     * Mark all notifications of a user as read
     *
     * Only notifications belonging to the given user
     * will be updated.
     */
    markAllAsRead(userId: string | Types.ObjectId): Promise<void>;
    /**
     * Delete notification
     *
     * IMPORTANT:
     * The notification must belong to the given user.
     */
    delete(id: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<INotification | null>;
}
export declare const notificationRepository: NotificationRepository;
export {};
//# sourceMappingURL=notification.repository.d.ts.map