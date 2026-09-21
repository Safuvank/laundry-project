import { z } from "zod";
import { PricingType } from "../constants/pricingType.js";
export declare const updateTurnaroundPlanSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    minHours: z.ZodOptional<z.ZodNumber>;
    maxHours: z.ZodOptional<z.ZodNumber>;
    pricingType: z.ZodOptional<z.ZodEnum<typeof PricingType>>;
    priceAdjustment: z.ZodOptional<z.ZodNumber>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=updateTurnaroundPlan.validator.d.ts.map