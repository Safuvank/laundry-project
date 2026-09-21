import { z } from "zod";
import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";
export declare const updatePricingSchema: z.ZodObject<{
    adjustmentType: z.ZodOptional<z.ZodEnum<typeof PricingAdjustmentType>>;
    amount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type UpdatePricingInput = z.infer<typeof updatePricingSchema>;
//# sourceMappingURL=updatePricing.validator.d.ts.map