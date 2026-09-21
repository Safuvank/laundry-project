import { Document, Types } from "mongoose";
import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../constants/deliveryAssignmentType.js";
export interface IDeliveryAssignment extends Document {
    /**
     * Order associated with this assignment
     */
    orderId: Types.ObjectId;
    /**
     * Delivery agent assigned to the order
     */
    deliveryAgentId: Types.ObjectId;
    /**
     * Type of assignment
     *
     * PICKUP or DELIVERY
     */
    assignmentType: DeliveryAssignmentType;
    /**
     * Assignment lifecycle:
     *
     * OFFERED
     * ACCEPTED
     * IN_PROGRESS
     * COMPLETED
     *
     * REJECTED / CANCELLED
     */
    status: DeliveryAssignmentStatus;
    /**
     * When the assignment was offered
     */
    offeredAt?: Date;
    /**
     * When the delivery agent accepted
     * the assignment
     */
    acceptedAt?: Date;
    /**
     * When the delivery agent rejected
     * the assignment
     */
    rejectedAt?: Date;
    /**
     * When the delivery agent started
     * the pickup or delivery
     */
    startedAt?: Date;
    /**
     * When the assignment was completed
     */
    completedAt?: Date;
    /**
     * Optional reason when an agent rejects
     * the assignment
     */
    rejectionReason?: string;
    /**
     * Active / inactive assignment
     */
    isActive: boolean;
    /**
     * Assignment creation timestamp
     */
    createdAt: Date;
    /**
     * Assignment last update timestamp
     */
    updatedAt: Date;
}
//# sourceMappingURL=IDeliveryAssignment.d.ts.map