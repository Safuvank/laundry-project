import { z } from "zod";

import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";

export const updatePricingSchema = z
  .object({
    adjustmentType: z
      .enum(PricingAdjustmentType)
      .optional(),

    amount: z
      .number()
      .min(0, "Amount must be greater than or equal to 0.")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update.",
    },
  );

export type UpdatePricingInput = z.infer<
  typeof updatePricingSchema
>;