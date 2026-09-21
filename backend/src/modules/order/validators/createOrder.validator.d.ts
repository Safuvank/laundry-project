import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{
    addressId: z.ZodString;
    turnaroundPlanId: z.ZodString;
    laundryServiceIds: z.ZodArray<z.ZodString>;
    pickupSlotId: z.ZodString;
    pickupLocation: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>;
    detergentPreference: z.ZodOptional<z.ZodString>;
    fabricSoftener: z.ZodOptional<z.ZodBoolean>;
    starchPreference: z.ZodOptional<z.ZodBoolean>;
    foldingPreference: z.ZodOptional<z.ZodString>;
    customerNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=createOrder.validator.d.ts.map