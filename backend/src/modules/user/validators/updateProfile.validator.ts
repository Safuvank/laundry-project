import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters.")
      .max(50, "First name cannot exceed 50 characters.")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters.")
      .max(50, "Last name cannot exceed 50 characters.")
      .optional(),

    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits.")
      .optional(),
  })
  .refine(
    (data) =>
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.phoneNumber !== undefined,
    {
      message: "At least one field must be provided for update.",
    }
  );