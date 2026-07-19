import type { Document } from "mongoose";

import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";

export interface ITurnaroundPlan extends Document {
  name: string;

  code: TurnaroundPlanCode;

  description: string;

  minHours: number;

  maxHours: number;

  pricingType: PricingType;

  priceAdjustment: number;

  isActive: boolean;

  sortOrder: number;

  createdAt: Date;

  updatedAt: Date;
}
