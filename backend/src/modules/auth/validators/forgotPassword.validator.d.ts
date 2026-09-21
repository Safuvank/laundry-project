import { z } from "zod";
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
//# sourceMappingURL=forgotPassword.validator.d.ts.map