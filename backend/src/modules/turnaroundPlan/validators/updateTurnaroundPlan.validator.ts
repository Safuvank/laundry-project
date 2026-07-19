import { z } from "zod";

import { PricingType } from "../constants/pricingType.js";

export const updateTurnaroundPlanSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters.")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),

    minHours: z
      .number()
      .nonnegative("Minimum hours cannot be negative.")
      .optional(),

    maxHours: z
      .number()
      .positive("Maximum hours must be greater than 0.")
      .optional(),

    pricingType: z.enum(PricingType).optional(),

    priceAdjustment: z
      .number()
      .nonnegative("Price adjustment cannot be negative.")
      .optional(),

    sortOrder: z
      .number()
      .int("Sort order must be an integer.")
      .nonnegative("Sort order cannot be negative.")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the turnaround plan.",
  })
  .refine(
    (data) => {
      if (data.minHours === undefined || data.maxHours === undefined) {
        return true;
      }

      return data.minHours <= data.maxHours;
    },
    {
      message:
        "Minimum turnaround hours cannot be greater than maximum turnaround hours.",
      path: ["maxHours"],
    },
  )
  .refine(
    (data) => {
      if (data.pricingType !== PricingType.NONE) {
        return true;
      }

      if (data.priceAdjustment === undefined) {
        return true;
      }

      return data.priceAdjustment === 0;
    },
    {
      message: "Price adjustment must be 0 when pricing type is NONE.",
      path: ["priceAdjustment"],
    },
  )
  .refine(
    (data) => {
      if (data.pricingType !== PricingType.PERCENTAGE) {
        return true;
      }

      if (data.priceAdjustment === undefined) {
        return true;
      }

      return data.priceAdjustment <= 100;
    },
    {
      message: "Percentage price adjustment cannot exceed 100.",
      path: ["priceAdjustment"],
    },
  );
