import { OAuth2Client } from "google-auth-library";

import { env } from "../../../config/env.js";

if (!env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not configured.");
}

if (!env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not configured.");
}

if (!env.GOOGLE_CALLBACK_URL) {
  throw new Error("GOOGLE_CALLBACK_URL is not configured.");
}

export const googleOAuthClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL,
);
