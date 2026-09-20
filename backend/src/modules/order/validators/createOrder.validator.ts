import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z
  .string()
  .refine(
    (value) => Types.ObjectId.isValid(value),
    "Invalid ID.",
  );

export const createOrderSchema = z.object({
  addressId: objectIdSchema,

  turnaroundPlanId: objectIdSchema,

  laundryServiceIds: z
    .array(objectIdSchema)
    .min(1, "Select at least one laundry service."),

  pickupSlotId: objectIdSchema,

  // Customer's current location at booking time.
  // This is used to find a nearby delivery agent.
  pickupLocation: z.object({
    latitude: z
      .number()
      .min(-90, "Invalid latitude.")
      .max(90, "Invalid latitude."),

    longitude: z
      .number()
      .min(-180, "Invalid longitude.")
      .max(180, "Invalid longitude."),
  }),

  detergentPreference: z
    .string()
    .trim()
    .optional(),

  fabricSoftener: z
    .boolean()
    .optional(),

  starchPreference: z
    .boolean()
    .optional(),

  foldingPreference: z
    .string()
    .trim()
    .optional(),

  customerNotes: z
    .string()
    .trim()
    .max(
      500,
      "Customer notes cannot exceed 500 characters.",
    )
    .optional(),
});
