import { z } from "zod";

import { AddressType } from "../constants/addresstype.js";

export const updateAddressSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name must not exceed 100 characters.")
      .optional(),

    phoneNumber: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number must not exceed 15 digits.")
      .optional(),

    addressLine1: z
      .string()
      .trim()
      .min(5, "Address Line 1 must be at least 5 characters.")
      .max(255, "Address Line 1 must not exceed 255 characters.")
      .optional(),

    addressLine2: z
      .string()
      .trim()
      .max(255, "Address Line 2 must not exceed 255 characters.")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required.")
      .max(100, "City must not exceed 100 characters.")
      .optional(),

    state: z
      .string()
      .trim()
      .min(2, "State is required.")
      .max(100, "State must not exceed 100 characters.")
      .optional(),

    postalCode: z
      .string()
      .trim()
      .min(4, "Postal code is invalid.")
      .max(10, "Postal code is invalid.")
      .optional(),

    country: z
      .string()
      .trim()
      .min(2, "Country is required.")
      .max(100, "Country must not exceed 100 characters.")
      .optional(),

    addressType: z.nativeEnum(AddressType).optional(),

    isDefault: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });