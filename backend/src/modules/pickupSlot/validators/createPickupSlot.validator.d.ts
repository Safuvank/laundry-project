import { z } from "zod";
export declare const createPickupSlotSchema: z.ZodObject<{
    date: z.ZodCoercedDate<unknown>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    capacity: z.ZodNumber;
}, z.core.$strict>;
export type CreatePickupSlotInput = z.infer<typeof createPickupSlotSchema>;
//# sourceMappingURL=createPickupSlot.validator.d.ts.map