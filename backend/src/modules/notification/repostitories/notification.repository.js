import { Types } from "mongoose";
import { Notification } from "../models/notification.model.js";
class NotificationRepository {
    /* -------------------------------------------------------------------------- */
    /*                                  CREATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Create notification
     */
    async create(data) {
        return Notification.create(data);
    }
    /* -------------------------------------------------------------------------- */
    /*                                FIND BY ID                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Find notification by ID
     *
     * Password is explicitly excluded from the populated user.
     */
    async findById(id) {
        return Notification.findById(id)
            .populate("userId", "-password")
            .populate("orderId");
    }
    /* -------------------------------------------------------------------------- */
    /*                           FIND BY USER ID                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Find all notifications for a user
     *
     * Newest notifications first.
     *
     * The query is scoped to the provided userId.
     */
    async findByUserId(userId) {
        return Notification.find({
            userId,
        }).sort({
            createdAt: -1,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                         FIND UNREAD BY USER                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Find unread notifications for a user
     */
    async findUnreadByUserId(userId) {
        return Notification.find({
            userId,
            isRead: false,
        }).sort({
            createdAt: -1,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                           COUNT UNREAD                                     */
    /* -------------------------------------------------------------------------- */
    /**
     * Count unread notifications for a user
     */
    async countUnreadByUserId(userId) {
        return Notification.countDocuments({
            userId,
            isRead: false,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                              MARK AS READ                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Mark one notification as read
     *
     * IMPORTANT:
     * The notification must belong to the given user.
     */
    async markAsRead(id, userId) {
        return Notification.findOneAndUpdate({
            _id: id,
            userId,
        }, {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                          MARK ALL AS READ                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Mark all notifications of a user as read
     *
     * Only notifications belonging to the given user
     * will be updated.
     */
    async markAllAsRead(userId) {
        await Notification.updateMany({
            userId,
            isRead: false,
        }, {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                                  DELETE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Delete notification
     *
     * IMPORTANT:
     * The notification must belong to the given user.
     */
    async delete(id, userId) {
        return Notification.findOneAndDelete({
            _id: id,
            userId,
        });
    }
}
export const notificationRepository = new NotificationRepository();
//# sourceMappingURL=notification.repository.js.map