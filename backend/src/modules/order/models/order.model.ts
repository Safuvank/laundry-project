import { Schema, model } from "mongoose";

import type { IOrder } from "../interfaces/IOrder.js";

import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";

const orderSchema = new Schema<IOrder>(
  {
    /**
     * Customer
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * Pickup Address
     */
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    /**
     * Customer Pickup Location
     *
     * Location captured from the customer's browser
     * at the time of booking.
     *
     * GeoJSON coordinates:
     * [longitude, latitude]
     */
    pickupLocation: {
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

    /**
     * Turnaround Plan
     */
    turnaroundPlanId: {
      type: Schema.Types.ObjectId,
      ref: "TurnaroundPlan",
      required: true,
    },

    /**
     * Laundry Services
     */
    laundryServiceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "LaundryService",
        required: true,
      },
    ],

    /**
     * Pickup
     */
    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTimeSlot: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Preferences
     */
    detergentPreference: {
      type: String,
      trim: true,
    },

    fabricSoftener: {
      type: Boolean,
      default: false,
    },

    starchPreference: {
      type: Boolean,
      default: false,
    },

    foldingPreference: {
      type: String,
      trim: true,
    },

    customerNotes: {
      type: String,
      trim: true,
    },

    /**
     * Pricing
     */
    estimatedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    finalPrice: {
      type: Number,
      min: 0,
    },

    pricingStatus: {
      type: String,
      enum: Object.values(PricingStatus),
      default: PricingStatus.ESTIMATED,
    },

    /**
     * Payment
     */
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    /**
     * Order Status
     */
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.BOOKED,
    },

    /**
     * Soft Delete
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
 * Customer Orders
 */
orderSchema.index({
  userId: 1,
  createdAt: -1,
});

/**
 * Order Status
 */
orderSchema.index({
  status: 1,
});

/**
 * Pricing Status
 */
orderSchema.index({
  pricingStatus: 1,
});

/**
 * Payment Status
 */
orderSchema.index({
  paymentStatus: 1,
});

/**
 * Pickup Schedule
 */
orderSchema.index({
  pickupDate: 1,
  pickupTimeSlot: 1,
});

/**
 * Active Orders
 */
orderSchema.index({
  isActive: 1,
});

/**
 * Customer Pickup Location
 *
 * Used for geospatial queries such as:
 * Find delivery agents within 5 km
 * of the customer's pickup location.
 */
orderSchema.index({
  pickupLocation: "2dsphere",
});

export const Order = model<IOrder>(
  "Order",
  orderSchema,
);
