import { z } from "zod";
import { PaymentMethod } from "../constants/paymentMethod.js";
export const createPaymentSchema = z.object({
    orderId: z.string().min(1, "Order ID is required."),
    paymentMethod: z.enum(Object.values(PaymentMethod), {
        message: "Invalid payment method.",
    }),
});
//# sourceMappingURL=createPayment.validator.js.map