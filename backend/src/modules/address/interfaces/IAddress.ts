import { Document, Types } from "mongoose";
import { AddressType } from "../constants/addresstype.js";

export interface IAddress extends Document {
  /*
  |--------------------------------------------------------------------------
  | Ownership
  |--------------------------------------------------------------------------
  */

  userId: Types.ObjectId;

  /*
  |--------------------------------------------------------------------------
  | Contact Information
  |--------------------------------------------------------------------------
  */

  fullName: string;

  phoneNumber: string;

  /*
  |--------------------------------------------------------------------------
  | Address Information
  |--------------------------------------------------------------------------
  */

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;


  country: string;

  /*
  |--------------------------------------------------------------------------
  | Address Type
  |--------------------------------------------------------------------------
  */

  addressType: AddressType;

   location: {
    type: "Point";
    coordinates: [number, number];
  };

  /*
  |--------------------------------------------------------------------------
  | Default Address
  |--------------------------------------------------------------------------
  */

  isDefault: boolean;
  isActive: boolean;

  /*
  |--------------------------------------------------------------------------
  | Timestamps
  |--------------------------------------------------------------------------
  */

  createdAt: Date;

  updatedAt: Date;
}
