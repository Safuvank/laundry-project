import { z } from "zod";

export const updatePickupSlotSchema = z
  .object({
    date: z.coerce.date().optional(),

    startTime: z
      .string()
      .trim()
      .min(1)
      .optional(),

    endTime: z
      .string()
      .trim()
      .min(1)
      .optional(),

    capacity: z
      .number()
      .int()
      .min(1)
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided for update.",
    },
  )
  .refine(
    (data) => {
      if (
        data.startTime &&
        data.endTime
      ) {
        return data.startTime !== data.endTime;
      }

      return true;
    },
    {
      message:
        "Start time and end time cannot be the same.",
      path: ["endTime"],
    },
  );

export type UpdatePickupSlotInput =
  z.infer<typeof updatePickupSlotSchema>;