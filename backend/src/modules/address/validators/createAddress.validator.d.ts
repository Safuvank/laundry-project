import { z } from "zod";
import { AddressType } from "../constants/addresstype.js";
export declare const createAddressSchema: z.ZodObject<{
    fullName: z.ZodString;
    phoneNumber: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodString;
    location: z.ZodObject<{
        type: z.ZodLiteral<"Point">;
        coordinates: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>;
    addressType: z.ZodEnum<typeof AddressType>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=createAddress.validator.d.ts.map