import { z } from "zod";
import { PaymentStatus } from "../constants/paymentStatus.js";
export const updatePaymentStatusSchema = z.object({
    paymentStatus: z.enum(Object.values(PaymentStatus)),
});
//# sourceMappingURL=updatePaymentStatus.validator.js.map