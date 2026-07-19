import mongoose, { Schema } from "mongoose";

import type { ITurnaroundPlan } from "../interfaces/ITurnaroundPlan.js";

import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";

const turnaroundPlanSchema = new Schema<ITurnaroundPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      enum: Object.values(TurnaroundPlanCode),
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    minHours: {
      type: Number,
      required: true,
      min: 0,
    },

    maxHours: {
      type: Number,
      required: true,
      min: 0,
    },

    pricingType: {
      type: String,
      enum: Object.values(PricingType),
      required: true,
      default: PricingType.NONE,
    },

    priceAdjustment: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

turnaroundPlanSchema.index({
  isActive: 1,
  sortOrder: 1,
});

export const TurnaroundPlan = mongoose.model<ITurnaroundPlan>(
  "TurnaroundPlan",
  turnaroundPlanSchema,
);
