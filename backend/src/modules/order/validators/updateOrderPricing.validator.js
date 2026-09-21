import { z } from "zod";
export const updateOrderPricingSchema = z.object({
    finalPrice: z.number().finite().min(0, "Final price cannot be negative."),
});
//# sourceMappingURL=updateOrderPricing.validator.js.map