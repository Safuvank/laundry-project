import { z } from "zod";
export declare const updatePickupSlotSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type UpdatePickupSlotInput = z.infer<typeof updatePickupSlotSchema>;
//# sourceMappingURL=updatePickupSlot.validator.d.ts.map