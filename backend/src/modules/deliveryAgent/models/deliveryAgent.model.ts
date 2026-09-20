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
      },

      coordinates: {
        type: [Number],
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

deliveryAgentSchema.index({
  status: 1,
});

deliveryAgentSchema.index({
  isActive: 1,
  status: 1,
});

/**
 * Geospatial index.
 *
 * Only delivery agents that have a valid currentLocation
 * can participate in nearby-location searches.
 */
deliveryAgentSchema.index({
  currentLocation: "2dsphere",
});

export const DeliveryAgent = model<IDeliveryAgent>(
  "DeliveryAgent",
  deliveryAgentSchema,
);
