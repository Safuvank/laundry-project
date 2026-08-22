import { Schema, model } from "mongoose";

import type { IDeliveryAgent } from "../interfaces/IDeliveryAgent.js";

import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";

const deliveryAgentSchema = new Schema<IDeliveryAgent>(
  {
    /* ---------------------------------------------------------------------- */
    /*                              User Account                              */
    /* ---------------------------------------------------------------------- */

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                Status                                  */
    /* ---------------------------------------------------------------------- */

    status: {
      type: String,
      enum: Object.values(DeliveryAgentStatus),
      default: DeliveryAgentStatus.OFFLINE,
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                         Contact Information                             */
    /* ---------------------------------------------------------------------- */

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                              Location                                  */
    /* ---------------------------------------------------------------------- */

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    /* ---------------------------------------------------------------------- */
    /*                               Active                                   */
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
/*                                  Indexes                                   */
/* -------------------------------------------------------------------------- */

/**
 * Find agents by status
 */
deliveryAgentSchema.index({
  status: 1,
});

/**
 * Find active agents by status
 */
deliveryAgentSchema.index({
  isActive: 1,
  status: 1,
});

/**
 * Geospatial index
 *
 * Used to find delivery agents
 * within a particular distance.
 */
deliveryAgentSchema.index({
  currentLocation: "2dsphere",
});

export const DeliveryAgent = model<IDeliveryAgent>(
  "DeliveryAgent",
  deliveryAgentSchema,
);
