import { z } from "zod";
import { AddressType } from "../constants/addresstype.js";
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
//# sourceMappingURL=createAddress.validator.js.map