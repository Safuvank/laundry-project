import { Types } from "mongoose";
import { NotificationType } from "../constants/notificationType.js";
export interface INotification {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    orderId?: Types.ObjectId;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=INotification.d.ts.map