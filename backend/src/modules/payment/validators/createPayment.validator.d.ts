import { z } from "zod";
import { PaymentMethod } from "../constants/paymentMethod.js";
export declare const createPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    paymentMethod: z.ZodEnum<{
        RAZORPAY: PaymentMethod.RAZORPAY;
        UPI: PaymentMethod.UPI;
        CARD: PaymentMethod.CARD;
        CASH: PaymentMethod.CASH;
    }>;
}, z.core.$strip>;
//# sourceMappingURL=createPayment.validator.d.ts.map