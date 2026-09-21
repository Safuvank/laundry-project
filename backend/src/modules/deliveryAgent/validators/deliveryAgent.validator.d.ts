import { z } from "zod";
export declare const createDeliveryAgentSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phoneNumber: z.ZodString;
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
}, z.core.$strip>;
export type CreateDeliveryAgentInput = z.infer<typeof createDeliveryAgentSchema>;
//# sourceMappingURL=deliveryAgent.validator.d.ts.map