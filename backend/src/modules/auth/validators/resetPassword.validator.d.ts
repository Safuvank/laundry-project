import { z } from "zod";
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=resetPassword.validator.d.ts.map