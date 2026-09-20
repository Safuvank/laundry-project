import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),

  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits."),

  addressLine1: z
    .string()
    .trim()
    .min(3, "Address line 1 is required.")
    .max(200, "Address line 1 cannot exceed 200 characters."),

  addressLine2: z
    .string()
    .trim()
    .max(200, "Address line 2 cannot exceed 200 characters.")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .max(100, "City cannot exceed 100 characters."),

  state: z
    .string()
    .trim()
    .min(2, "State is required.")
    .max(100, "State cannot exceed 100 characters."),

  postalCode: z
    .string()
    .trim()
    .min(4, "Postal code must be at least 4 characters.")
    .max(10, "Postal code cannot exceed 10 characters."),

  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .max(100, "Country cannot exceed 100 characters."),

  addressType: z.string().trim().min(1, "Please select an address type."),

  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),

  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
