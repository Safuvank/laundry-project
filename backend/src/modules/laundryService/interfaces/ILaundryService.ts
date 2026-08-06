import type { Document } from "mongoose";

import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
import { PricingMode } from "../constants/pricingMode.js";

export interface ILaundryService extends Document {
  name: string;

  code: LaundryServiceCode;

  description: string;

  pricingMode: PricingMode;

  isActive: boolean;

  sortOrder: number;

  createdAt: Date;

  updatedAt: Date;
}