import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: process.env.MONGODB_URI || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  //mail

  SMTP_HOST: process.env.SMTP_HOST || "",

  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,

  SMTP_SECURE: process.env.SMTP_SECURE === "true",

  SMTP_USER: process.env.SMTP_USER || "",

  SMTP_PASS: process.env.SMTP_PASS || "",

  MAIL_FROM: process.env.MAIL_FROM || "",

  FRONTEND_URL: process.env.FRONTEND_URL || "",
};
