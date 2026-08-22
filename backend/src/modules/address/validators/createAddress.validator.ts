import { z } from "zod";

import { AddressType } from "../constants/addresstype.js";

// export const createAddressSchema = z.object({
//   fullName: z
//     .string()
//     .trim()
//     .min(2, "Full name must be at least 2 characters.")
//     .max(100, "Full name must not exceed 100 characters."),

//   phoneNumber: z
//     .string()
//     .trim()
//     .min(10, "Phone number must be at least 10 digits.")
//     .max(15, "Phone number must not exceed 15 digits."),

//   addressLine1: z
//     .string()
//     .trim()
//     .min(5, "Address Line 1 must be at least 5 characters.")
//     .max(255, "Address Line 1 must not exceed 255 characters."),

//   addressLine2: z
//     .string()
//     .trim()
//     .max(255, "Address Line 2 must not exceed 255 characters.")
//     .optional(),

//   city: z
//     .string()
//     .trim()
//     .min(2, "City is required.")
//     .max(100, "City must not exceed 100 characters."),

//   state: z
//     .string()
//     .trim()
//     .min(2, "State is required.")
//     .max(100, "State must not exceed 100 characters."),

//   postalCode: z
//     .string()
//     .trim()
//     .min(4, "Postal code is invalid.")
//     .max(10, "Postal code is invalid."),

//   country: z
//     .string()
//     .trim()
//     .min(2, "Country is required.")
//     .max(100, "Country must not exceed 100 characters.")
//     .optional(),

//   addressType: z.nativeEnum(AddressType),

//   isDefault: z.boolean().optional(),
// });

const locationSchema = z.object({
  type: z.literal("Point"),

  coordinates: z
    .array(z.number())
    .length(2, "Coordinates must contain longitude and latitude.")
    .superRefine((coordinates, ctx) => {
      const longitude = coordinates[0];
      const latitude = coordinates[1];

      if (longitude === undefined || longitude < -180 || longitude > 180) {
        ctx.addIssue({
          code: "custom",
          message: "Longitude must be between -180 and 180.",
        });
      }

      if (latitude === undefined || latitude < -90 || latitude > 90) {
        ctx.addIssue({
          code: "custom",
          message: "Latitude must be between -90 and 90.",
        });
      }
    }),
});

export const createAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),

  phoneNumber: z.string().trim().min(10).max(15),

  addressLine1: z.string().trim().min(5).max(255),

  addressLine2: z.string().trim().max(255).optional(),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  postalCode: z.string().trim().min(4).max(10),

  country: z.string().trim().min(2).max(100),

  location: locationSchema,

  addressType: z.nativeEnum(AddressType),

  isDefault: z.boolean().optional(),
});
