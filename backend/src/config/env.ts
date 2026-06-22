import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  NODE_ENV:
    process.env.NODE_ENV || "development",

  MONGODB_URI:
    process.env.MONGODB_URI || "",

  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "",

  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "",
};