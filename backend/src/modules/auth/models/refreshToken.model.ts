import mongoose, { Schema, Types } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    deviceInfo: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);