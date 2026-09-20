export interface TurnaroundPlan {
  _id: string;

  name: string;
  code: string;
  description: string;

  minHours: number;
  maxHours: number;

  pricingType: string;
  adjustmentType: string;
  priceAdjustment: number;

  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

export interface TurnaroundPlansResponse {
  success: boolean;
  message: string;
  data: TurnaroundPlan[];
}
