import dotenv from "dotenv";

dotenv.config();

export const env = {
  // --------------------------------------------------------------------------
  // Server
  // --------------------------------------------------------------------------

  PORT: process.env.PORT || "5000",

  NODE_ENV: process.env.NODE_ENV || "development",

  // --------------------------------------------------------------------------
  // Database
  // --------------------------------------------------------------------------

  MONGODB_URI: process.env.MONGODB_URI || "",

  // --------------------------------------------------------------------------
  // Authentication
  // --------------------------------------------------------------------------

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  // --------------------------------------------------------------------------
  // Google OAuth
  // --------------------------------------------------------------------------

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/v1/auth/google/callback",

  // --------------------------------------------------------------------------
  // Email - Resend
  // --------------------------------------------------------------------------

  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  MAIL_FROM: process.env.MAIL_FROM || "",

  // --------------------------------------------------------------------------
  // Frontend
  // --------------------------------------------------------------------------

  FRONTEND_URL: process.env.FRONTEND_URL || "",
};