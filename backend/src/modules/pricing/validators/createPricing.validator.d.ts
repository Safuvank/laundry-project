import { z } from "zod";
import { PricingType } from "../constants/pricingType.js";
import { PricingAdjustmentType } from "../constants/pricingAdjustmentType.js";
export declare const createPricingSchema: z.ZodObject<{
    laundryServiceId: z.ZodString;
    pricingType: z.ZodEnum<typeof PricingType>;
    adjustmentType: z.ZodOptional<z.ZodEnum<typeof PricingAdjustmentType>>;
    amount: z.ZodNumber;
}, z.core.$strict>;
export type CreatePricingInput = z.infer<typeof createPricingSchema>;
//# sourceMappingURL=createPricing.validator.d.ts.map