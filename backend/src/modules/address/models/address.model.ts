import { Schema, model } from "mongoose";

import type { IAddress } from "../interfaces/IAddress.js";
import { AddressType } from "../constants/addresstype.js";

const addressSchema = new Schema<IAddress>(
  {
    /*
    |--------------------------------------------------------------------------
    | Ownership
    |--------------------------------------------------------------------------
    */

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    */

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Address Information
    |--------------------------------------------------------------------------
    */

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },

    /*
    |--------------------------------------------------------------------------
    | Address Type
    |--------------------------------------------------------------------------
    */

    addressType: {
      type: String,
      enum: Object.values(AddressType),
      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Default Address
    |--------------------------------------------------------------------------
    */

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

// Frequently used: Get all addresses of a user
addressSchema.index({ userId: 1 });

// Frequently used: Find the default address of a user
addressSchema.index({ userId: 1, isDefault: 1 });

export const Address = model<IAddress>("Address", addressSchema);
