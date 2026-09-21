import { z } from "zod";
import { PASSWORD_REGEX } from "../../auth/constants/password.js";
export const changePasswordSchema = z
    .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
        .string()
        .regex(PASSWORD_REGEX, "Password does not meet the requirements."),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your new password."),
})
    .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
//# sourceMappingURL=changePassword.validator.js.map