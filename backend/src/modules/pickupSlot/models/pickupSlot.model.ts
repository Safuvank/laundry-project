import { Schema, model } from "mongoose";

import type { IPickupSlot } from "../interfaces/IPickupSlot.js";

import { SlotStatus } from "../constants/slotStatus.js";

const pickupSlotSchema = new Schema<IPickupSlot>(
  {
    /**
     * Pickup Date
     */
    date: {
      type: Date,
      required: true,
    },

    /**
     * Slot Timing
     */
    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Maximum Capacity
     */
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    /**
     * Current Bookings
     */
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Slot Status
     */
    status: {
      type: String,
      enum: Object.values(SlotStatus),
      default: SlotStatus.AVAILABLE,
    },

    /**
     * Active / Inactive
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

/**
 * Prevent duplicate slots
 */
pickupSlotSchema.index(
  {
    date: 1,
    startTime: 1,
    endTime: 1,
  },
  {
    unique: true,
  },
);

/**
 * Customer searches
 */
pickupSlotSchema.index({
  date: 1,
  status: 1,
  isActive: 1,
});

/**
 * Admin management
 */
pickupSlotSchema.index({
  isActive: 1,
  createdAt: -1,
});

export const PickupSlot = model<IPickupSlot>(
  "PickupSlot",
  pickupSlotSchema,
);