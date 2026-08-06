import { Schema, model } from "mongoose";

import type { IPricingRule } from "../interfaces/IPricingRule.js";

import { PricingType } from "../constants/pricingType.js";
import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";

const pricingRuleSchema = new Schema<IPricingRule>(
  {
    /**
     * Related Laundry Service
     */
    laundryServiceId: {
      type: Schema.Types.ObjectId,
      ref: "LaundryService",
      required: true,
    },

    /**
     * BASE
     * MINIMUM
     * PICKUP
     * DELIVERY
     * TURNAROUND
     */
    pricingType: {
      type: String,
      enum: Object.values(PricingType),
      required: true,
    },

    /**
     * NONE
     * FIXED
     * PERCENTAGE
     */
    adjustmentType: {
      type: String,
      enum: Object.values(PricingAdjustmentType),
      default: PricingAdjustmentType.NONE,
    },

    /**
     * Price / Amount
     *
     * Examples:
     * 80
     * 200
     * 50
     * 20
     */
    amount: {
      type: Number,
      required: true,
      min: 0,
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

/**
 * One pricing rule of each type per laundry service.
 *
 * Example:
 * Wash & Fold
 *   ├── BASE
 *   ├── MINIMUM
 *   └── PICKUP
 */
pricingRuleSchema.index(
  {
    laundryServiceId: 1,
    pricingType: 1,
  },
  {
    unique: true,
  },
);

/**
 * Faster customer queries
 */
pricingRuleSchema.index({
  isActive: 1,
});

export const PricingRule = model<IPricingRule>(
  "PricingRule",
  pricingRuleSchema,
);
