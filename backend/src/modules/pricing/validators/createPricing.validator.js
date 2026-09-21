import { z } from "zod";
import { PricingType } from "../constants/pricingType.js";
import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";
export const createPricingSchema = z
    .object({
    laundryServiceId: z
        .string()
        .trim()
        .min(1, "Laundry service id is required."),
    pricingType: z.enum(PricingType),
    adjustmentType: z
        .enum(PricingAdjustmentType)
        .optional(),
    amount: z
        .number()
        .min(0, "Amount must be greater than or equal to 0."),
})
    .strict();
//# sourceMappingURL=createPricing.validator.js.map