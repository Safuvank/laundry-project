import { z } from "zod";
import { PaymentStatus } from "../constants/paymentStatus.js";
export declare const updatePaymentStatusSchema: z.ZodObject<{
    paymentStatus: z.ZodEnum<{
        PENDING: PaymentStatus.PENDING;
        PAID: PaymentStatus.PAID;
        FAILED: PaymentStatus.FAILED;
        REFUNDED: PaymentStatus.REFUNDED;
    }>;
}, z.core.$strip>;
//# sourceMappingURL=updatePaymentStatus.validator.d.ts.map