import Razorpay from "razorpay";

import { env } from "../../../config/env.js";

if (!env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID is not configured.");
}

if (!env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET is not configured.");
}

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});