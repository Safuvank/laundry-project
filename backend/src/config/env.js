import dotenv from "dotenv";
dotenv.config();
export const env = {
    PORT: process.env.PORT || "5000",
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI || "",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    // --------------------------------------------------------------------------
    // Google OAuth
    // --------------------------------------------------------------------------
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/v1/auth/google/callback",
    // --------------------------------------------------------------------------
    // Mail
    // --------------------------------------------------------------------------
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_SECURE: process.env.SMTP_SECURE === "true",
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    MAIL_FROM: process.env.MAIL_FROM || "",
    // --------------------------------------------------------------------------
    // Frontend
    // --------------------------------------------------------------------------
    FRONTEND_URL: process.env.FRONTEND_URL || "",
};
//# sourceMappingURL=env.js.map