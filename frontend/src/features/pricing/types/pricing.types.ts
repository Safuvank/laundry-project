export type PricingType =
  | "BASE"
  | "MINIMUM"
  | "PICKUP"
  | "DELIVERY"
  | "TURNAROUND";

export type PricingAdjustmentType =
  | "NONE"
  | "FIXED"
  | "PERCENTAGE";

/* -------------------------------------------------------------------------- */
/*                         Laundry Service Types                              */
/* -------------------------------------------------------------------------- */

export interface PricingLaundryService {
  _id: string;
  name: string;
  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Pricing Rule                                  */
/* -------------------------------------------------------------------------- */

export interface PricingRule {
  _id: string;

  /**
   * Backend returns this as a populated laundry service object
   */
  laundryServiceId: PricingLaundryService;

  pricingType: PricingType;

  adjustmentType: PricingAdjustmentType;

  amount: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                         Create Pricing Payload                             */
/* -------------------------------------------------------------------------- */

export interface CreatePricingPayload {
  laundryServiceId: string;

  pricingType: PricingType;

  adjustmentType: PricingAdjustmentType;

  amount: number;
}

/* -------------------------------------------------------------------------- */
/*                         Update Pricing Payload                             */
/* -------------------------------------------------------------------------- */

export interface UpdatePricingPayload {
  adjustmentType?: PricingAdjustmentType;

  amount?: number;

  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              API Responses                                 */
/* -------------------------------------------------------------------------- */

export interface PricingResponse {
  success: boolean;

  message: string;

  data: PricingRule;
}

export interface PricingRulesResponse {
  success: boolean;

  message: string;

  data: PricingRule[];
}
