import { z } from "zod";

import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";

export const createTurnaroundPlanSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    code: z.enum(TurnaroundPlanCode),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),

    minHours: z.number().nonnegative("Minimum hours cannot be negative."),

    maxHours: z.number().positive("Maximum hours must be greater than 0."),

    pricingType: z.enum(PricingType),

    priceAdjustment: z
      .number()
      .nonnegative("Price adjustment cannot be negative."),

    isActive: z.boolean().optional(),

    sortOrder: z
      .number()
      .int("Sort order must be an integer.")
      .nonnegative("Sort order cannot be negative.")
      .optional(),
  })
  .refine((data) => data.minHours <= data.maxHours, {
    message:
      "Minimum turnaround hours cannot be greater than maximum turnaround hours.",
    path: ["maxHours"],
  })
  .refine(
    (data) =>
      !(data.pricingType === PricingType.NONE && data.priceAdjustment !== 0),
    {
      message: "Price adjustment must be 0 when pricing type is NONE.",
      path: ["priceAdjustment"],
    },
  )
  .refine(
    (data) =>
      !(
        data.pricingType === PricingType.PERCENTAGE &&
        data.priceAdjustment > 100
      ),
    {
      message: "Percentage price adjustment cannot exceed 100.",
      path: ["priceAdjustment"],
    },
  );
