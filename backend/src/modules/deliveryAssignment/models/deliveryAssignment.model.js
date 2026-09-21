import { Schema, model } from "mongoose";
import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../constants/deliveryAssignmentType.js";
const deliveryAssignmentSchema = new Schema({
    /* ---------------------------------------------------------------------- */
    /*                                  ORDER                                 */
    /* ---------------------------------------------------------------------- */
    /**
     * Order associated with this assignment
     */
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                           ASSIGNMENT TYPE                              */
    /* ---------------------------------------------------------------------- */
    /**
     * Type of delivery assignment
     *
     * PICKUP   → Agent picks up laundry from customer
     * DELIVERY → Agent delivers laundry to customer
     */
    assignmentType: {
        type: String,
        enum: Object.values(DeliveryAssignmentType),
        required: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                             DELIVERY AGENT                             */
    /* ---------------------------------------------------------------------- */
    /**
     * Delivery agent assigned to the order
     */
    deliveryAgentId: {
        type: Schema.Types.ObjectId,
        ref: "DeliveryAgent",
        required: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                                STATUS                                  */
    /* ---------------------------------------------------------------------- */
    /**
     * Assignment lifecycle:
     *
     * OFFERED
     *    ↓
     * ACCEPTED
     *    ↓
     * IN_PROGRESS
     *    ↓
     * COMPLETED
     *
     * REJECTED / CANCELLED are terminal states.
     */
    status: {
        type: String,
        enum: Object.values(DeliveryAssignmentStatus),
        required: true,
        default: DeliveryAssignmentStatus.OFFERED,
    },
    /* ---------------------------------------------------------------------- */
    /*                              TIMESTAMPS                                */
    /* ---------------------------------------------------------------------- */
    /**
     * When assignment was offered
     */
    offeredAt: {
        type: Date,
    },
    /**
     * When agent accepted assignment
     */
    acceptedAt: {
        type: Date,
    },
    /**
     * When agent rejected assignment
     */
    rejectedAt: {
        type: Date,
    },
    /**
     * When agent started working on the assignment
     */
    startedAt: {
        type: Date,
    },
    /**
     * When assignment was completed
     */
    completedAt: {
        type: Date,
    },
    /* ---------------------------------------------------------------------- */
    /*                          REJECTION REASON                              */
    /* ---------------------------------------------------------------------- */
    rejectionReason: {
        type: String,
        trim: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                                ACTIVE                                  */
    /* ---------------------------------------------------------------------- */
    /**
     * Whether this assignment is currently active.
     *
     * OFFERED / ACCEPTED / IN_PROGRESS → true
     * REJECTED / COMPLETED / CANCELLED → false
     */
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
/* -------------------------------------------------------------------------- */
/*                                  INDEXES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Find assignments belonging to an order.
 */
deliveryAssignmentSchema.index({
    orderId: 1,
});
/**
 * Find assignments belonging to a delivery agent.
 */
deliveryAssignmentSchema.index({
    deliveryAgentId: 1,
});
/**
 * Find assignments by status.
 */
deliveryAssignmentSchema.index({
    status: 1,
});
/**
 * Useful for finding active assignments
 * for a particular delivery agent.
 */
deliveryAssignmentSchema.index({
    deliveryAgentId: 1,
    isActive: 1,
});
/**
 * Useful for finding active assignments
 * for a particular order.
 */
deliveryAssignmentSchema.index({
    orderId: 1,
    isActive: 1,
});
/**
 * Find recent assignments quickly.
 */
deliveryAssignmentSchema.index({
    createdAt: -1,
});
export const DeliveryAssignment = model("DeliveryAssignment", deliveryAssignmentSchema);
//# sourceMappingURL=deliveryAssignment.model.js.map