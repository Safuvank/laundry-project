import { z } from "zod";
import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
import { PricingMode } from "../constants/pricingMode.js";
export declare const createLaundryServiceSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodEnum<typeof LaundryServiceCode>;
    description: z.ZodOptional<z.ZodString>;
    pricingMode: z.ZodEnum<typeof PricingMode>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type CreateLaundryServiceInput = z.infer<typeof createLaundryServiceSchema>;
//# sourceMappingURL=createLaundryService.validator.d.ts.map