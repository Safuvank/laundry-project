import { z } from "zod";
import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";
export declare const createTurnaroundPlanSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodEnum<typeof TurnaroundPlanCode>;
    description: z.ZodOptional<z.ZodString>;
    minHours: z.ZodNumber;
    maxHours: z.ZodNumber;
    pricingType: z.ZodEnum<typeof PricingType>;
    priceAdjustment: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=createTurnaroundPlan.validator.d.ts.map