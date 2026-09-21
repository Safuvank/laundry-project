import { z } from "zod";
export const createDeliveryAgentSchema = z.object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
    phoneNumber: z.string().trim().min(7).max(20),
    longitude: z.number().min(-180).max(180),
    latitude: z.number().min(-90).max(90),
});
//# sourceMappingURL=deliveryAgent.validator.js.map