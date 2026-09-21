import { z } from "zod";
import { PricingMode } from "../constants/pricingMode.js";
export const updateLaundryServiceSchema = z
    .object({
    name: z
        .string()
        .trim()
        .min(2, "Service name must be at least 2 characters.")
        .max(100, "Service name cannot exceed 100 characters.")
        .optional(),
    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),
    pricingMode: z
        .enum(PricingMode)
        .optional(),
    sortOrder: z
        .number()
        .int("Sort order must be an integer.")
        .min(0, "Sort order cannot be negative.")
        .optional(),
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
});
//# sourceMappingURL=updateLaundryService.validator.js.map