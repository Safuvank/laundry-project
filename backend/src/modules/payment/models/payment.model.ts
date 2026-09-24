import { Schema, model } from "mongoose";

import type { IPayment } from "../interfaces/IPayment.js";

import { PaymentStatus } from "../constants/paymentStatus.js";
import { PaymentMethod } from "../constants/paymentMethod.js";

const paymentSchema = new Schema<IPayment>(
  {
    /* ---------------------------------------------------------------------- */
    /*                                  ORDER                                 */
    /* ---------------------------------------------------------------------- */

    /**
     * Order associated with this payment
     */
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                  USER                                  */
    /* ---------------------------------------------------------------------- */

    /**
     * Customer who owns this payment
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                 AMOUNT                                 */
    /* ---------------------------------------------------------------------- */

    /**
     * Payment amount
     *
     * This must be calculated from Order.finalPrice
     * by the backend.
     */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------------------------------------------------------------------- */
    /*                                 STATUS                                 */
    /* ---------------------------------------------------------------------- */

    /**
     * Current payment status
     */
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.PENDING,
    },

    /* ---------------------------------------------------------------------- */
    /*                            PAYMENT METHOD                              */
    /* ---------------------------------------------------------------------- */

    /**
     * Payment method selected by the customer
     */
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
    },

    /* ---------------------------------------------------------------------- */
    /*                           PAYMENT GATEWAY                               */
    /* ---------------------------------------------------------------------- */

    /**
     * Gateway transaction/payment ID
     */
    transactionId: {
      type: String,
      trim: true,
      index: true,
    },

    /**
     * Gateway order ID
     */
    gatewayOrderId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
      unique: true
    },
    gatewaySignature: {
      type: String,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                              PAYMENT TIME                               */
    /* ---------------------------------------------------------------------- */

    /**
     * When payment was successfully completed
     */
    paidAt: {
      type: Date,
    },

    /* ---------------------------------------------------------------------- */
    /*                             FAILURE INFO                                */
    /* ---------------------------------------------------------------------- */

    /**
     * Reason for payment failure
     */
    failureReason: {
      type: String,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                              REFUND INFO                                */
    /* ---------------------------------------------------------------------- */

    /**
     * Refund transaction/reference ID
     *
     * This should eventually come from
     * the payment gateway.
     */
    refundId: {
      type: String,
      trim: true,
      index: true,
    },

    /**
     * Reason for refund
     */
    refundReason: {
      type: String,
      trim: true,
    },

    /**
     * When payment was refunded
     */
    refundedAt: {
      type: Date,
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
 * Find payments belonging to an order.
 */
paymentSchema.index({
  orderId: 1,
});

/**
 * Find payments belonging to a user.
 */
paymentSchema.index({
  userId: 1,
});

/**
 * Find payments by status.
 */
paymentSchema.index({
  status: 1,
});

/**
 * Find a user's payments ordered by newest first.
 */
paymentSchema.index({
  userId: 1,
  createdAt: -1,
});

export const Payment = model<IPayment>("Payment", paymentSchema);
