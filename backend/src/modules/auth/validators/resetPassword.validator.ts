import { z } from "zod";
import { PASSWORD_REGEX } from "../constants/password.js";

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required"),

    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;