import crypto from "node:crypto";

import { razorpay } from "../config/razorpay.config.js";

interface CreateRazorpayOrderInput {
  amount: number;
  currency: string;
  receipt: string;
}

interface RazorpayOrderResult {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

class RazorpayService {
  /* ------------------------------------------------------------------------ */
  /*                           CREATE ORDER                                   */
  /* ------------------------------------------------------------------------ */

  async createOrder(
    input: CreateRazorpayOrderInput,
  ): Promise<RazorpayOrderResult> {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Invalid Razorpay order amount.");
    }

    const amountInPaise = Math.round(input.amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: input.currency,
      receipt: input.receipt,
    });

    return order as RazorpayOrderResult;
  }

  /* ------------------------------------------------------------------------ */
  /*                         VERIFY PAYMENT                                   */
  /* ------------------------------------------------------------------------ */

  verifyPayment(input: VerifyPaymentInput): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      input;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return false;
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`,
      )
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature),
    );
  }
}

export const razorpayService = new RazorpayService();