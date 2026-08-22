import { z } from "zod";

export const createPickupSlotSchema = z
  .object({
    date: z.coerce.date({
      error: "Valid pickup date is required.",
    }),

    startTime: z
      .string()
      .trim()
      .min(1, "Start time is required."),

    endTime: z
      .string()
      .trim()
      .min(1, "End time is required."),

    capacity: z
      .number()
      .int()
      .min(1, "Capacity must be at least 1."),
  })
  .strict()
  .refine(
    (data) => data.startTime !== data.endTime,
    {
      message: "Start time and end time cannot be the same.",
      path: ["endTime"],
    },
  );

export type CreatePickupSlotInput =
  z.infer<typeof createPickupSlotSchema>;