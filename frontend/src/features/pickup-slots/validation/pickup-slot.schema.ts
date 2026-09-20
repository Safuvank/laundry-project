import { z } from "zod";

export const pickupSlotSchema = z
  .object({
    date: z
      .string()
      .min(1, "Pickup date is required"),

    startTime: z
      .string()
      .min(1, "Start time is required"),

    endTime: z
      .string()
      .min(1, "End time is required"),

    capacity: z
      .number()
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1"),
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type PickupSlotFormData = z.infer<
  typeof pickupSlotSchema
>;
