import { Schema, model } from "mongoose";
import { AddressType } from "../constants/addresstype.js";
const addressSchema = new Schema({
    /* ---------------------------------------------------------------------- */
    /*                               OWNERSHIP                                */
    /* ---------------------------------------------------------------------- */
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                           CONTACT INFORMATION                           */
    /* ---------------------------------------------------------------------- */
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
    /* ---------------------------------------------------------------------- */
    /*                            ADDRESS INFORMATION                          */
    /* ---------------------------------------------------------------------- */
    addressLine1: {
        type: String,
        required: true,
        trim: true,
    },
    addressLine2: {
        type: String,
        trim: true,
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
    },
    /* ---------------------------------------------------------------------- */
    /*                              GEO LOCATION                              */
    /* ---------------------------------------------------------------------- */
    /**
     * Customer address location.
     *
     * GeoJSON format:
     *
     * {
     *   type: "Point",
     *   coordinates: [longitude, latitude]
     * }
     */
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    /* ---------------------------------------------------------------------- */
    /*                             ADDRESS TYPE                               */
    /* ---------------------------------------------------------------------- */
    addressType: {
        type: String,
        enum: Object.values(AddressType),
        required: true,
    },
    /* ---------------------------------------------------------------------- */
    /*                             ADDRESS STATUS                             */
    /* ---------------------------------------------------------------------- */
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
/* -------------------------------------------------------------------------- */
/*                                  INDEXES                                   */
/* -------------------------------------------------------------------------- */
/**
 * Geospatial index.
 *
 * Used for location-based queries.
 */
addressSchema.index({
    location: "2dsphere",
});
/**
 * Find user's addresses quickly.
 */
addressSchema.index({
    userId: 1,
});
/**
 * Find active addresses belonging to a user.
 */
addressSchema.index({
    userId: 1,
    isActive: 1,
});
export const Address = model("Address", addressSchema);
//# sourceMappingURL=address.model.js.map