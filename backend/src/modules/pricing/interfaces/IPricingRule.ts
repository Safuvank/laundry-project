import { Types, Document } from "mongoose";

import { PricingMode } from "../../laundryService/constants/pricingMode.js";
import { PricingType } from "../constants/pricingType.js";
import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";

export interface IPricingRule extends Document {
  /**
   * Laundry Service
   * Example:
   * Wash & Fold
   * Dry Cleaning
   */
  laundryServiceId: Types.ObjectId;

  /**
   * Pricing Rule Type
   * BASE
   * MINIMUM
   * PICKUP
   * DELIVERY
   * TURNAROUND
   */
  pricingType: PricingType;

  /**
   * WEIGHT | ITEM
   */
  pricingMode: PricingMode;

  /**
   * NONE | FIXED | PERCENTAGE
   */
  adjustmentType: PricingAdjustmentType;

  /**
   * Price / Amount
   *
   * Examples:
   * ₹80
   * ₹200
   * 20 (%)
   */
  amount: number;

  /**
   * Whether this pricing rule is active
   */
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
