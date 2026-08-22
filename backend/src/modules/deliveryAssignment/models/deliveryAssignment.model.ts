import { Schema, model } from "mongoose";

import type { IDeliveryAssignment } from "../interfaces/IDeliveryAssignment.js";

import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";

import { DeliveryAssignmentType } from "../constants/deliveryAssignmentType.js";

const deliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
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
     * Assignment status
     */
    status: {
      type: String,
      enum: Object.values(DeliveryAssignmentStatus),
      required: true,
      default: DeliveryAssignmentStatus.PENDING,
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

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

export const DeliveryAssignment = model<IDeliveryAssignment>(
  "DeliveryAssignment",
  deliveryAssignmentSchema,
);
