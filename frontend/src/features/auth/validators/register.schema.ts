import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required."),

    lastName: z.string().trim().min(2, "Last name is required."),

    email: z.string().trim().email("Please enter a valid email address."),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "Please enter your phone number.")
      .regex(
        /^\+[1-9]\d{7,14}$/,
        "Please enter a valid international phone number.",
      ),

    password: z.string().min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
