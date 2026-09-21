import { z } from "zod";
import { AddressType } from "../constants/addresstype.js";
export declare const updateAddressSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodOptional<z.ZodString>;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    addressType: z.ZodOptional<z.ZodEnum<typeof AddressType>>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=updateAddress.validator.d.ts.map