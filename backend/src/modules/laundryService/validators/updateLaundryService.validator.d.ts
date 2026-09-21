import { z } from "zod";
import { PricingMode } from "../constants/pricingMode.js";
export declare const updateLaundryServiceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    pricingMode: z.ZodOptional<z.ZodEnum<typeof PricingMode>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type UpdateLaundryServiceInput = z.infer<typeof updateLaundryServiceSchema>;
//# sourceMappingURL=updateLaundryService.validator.d.ts.map