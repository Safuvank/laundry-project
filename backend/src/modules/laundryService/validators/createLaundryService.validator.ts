import { z } from "zod";

import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
import { PricingMode } from "../constants/pricingMode.js";

export const createLaundryServiceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Service name must be at least 2 characters.")
      .max(100, "Service name cannot exceed 100 characters."),

    code: z.enum(LaundryServiceCode),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),

    pricingMode: z.enum(PricingMode),

    sortOrder: z
      .number()
      .int("Sort order must be an integer.")
      .min(0, "Sort order cannot be negative.")
      .optional(),
  })
  .strict();

export type CreateLaundryServiceInput = z.infer<
  typeof createLaundryServiceSchema
>;