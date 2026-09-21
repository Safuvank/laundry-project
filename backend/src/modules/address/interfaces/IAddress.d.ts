import { Document, Types } from "mongoose";
import { AddressType } from "../constants/addresstype.js";
export interface IAddress extends Document {
    userId: Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: AddressType;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=IAddress.d.ts.map