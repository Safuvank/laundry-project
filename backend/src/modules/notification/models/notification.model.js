import { Schema, model } from "mongoose";
import { NotificationType } from "../constants/notificationType.js";
const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        index: true,
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
    readAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/
/**
 * Used when fetching a user's notifications
 * with newest notifications first.
 */
notificationSchema.index({
    userId: 1,
    createdAt: -1,
});
/**
 * Used when fetching unread notifications.
 */
notificationSchema.index({
    userId: 1,
    isRead: 1,
});
export const Notification = model("Notification", notificationSchema);
//# sourceMappingURL=notification.model.js.map