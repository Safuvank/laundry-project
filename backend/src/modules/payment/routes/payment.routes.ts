import { Router } from "express";

import { paymentController } from "../controllers/payment.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";

import { authorize } from "../../../shared/middlewares/authorize.js";

import { UserRole } from "../../auth/constants/roles.js";

import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { createPaymentSchema } from "../validators/createPayment.validator.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                              CUSTOMER                                      */
/* -------------------------------------------------------------------------- */

/**
 * Create FreshFold payment
 *
 * POST /api/v1/payments
 *
 * Body:
 * {
 *   "orderId": "...",
 *   "paymentMethod": "UPI"
 * }
 *
 * IMPORTANT:
 * The amount is NOT accepted from the frontend.
 * PaymentService gets the amount from order.finalPrice.
 */
router.post(
  "/",
  authenticate,
  validateRequest(createPaymentSchema),
  paymentController.createPayment,
);

/**
 * Get my payments
 *
 * GET /api/v1/payments/my-payments
 */
router.get("/my-payments", authenticate, paymentController.getMyPayments);

/**
 * Get payment by order
 *
 * GET /api/v1/payments/order/:orderId
 */
router.get("/order/:orderId", authenticate, paymentController.getByOrderId);

/* -------------------------------------------------------------------------- */
/*                            RAZORPAY                                       */
/* -------------------------------------------------------------------------- */

/**
 * Create Razorpay order
 *
 * POST /api/v1/payments/:id/razorpay-order
 *
 * The payment ID is passed through the URL.
 *
 * No amount is accepted from the frontend.
 *
 * Backend:
 *
 * 1. Finds the FreshFold payment
 * 2. Verifies payment ownership
 * 3. Gets the amount from the FreshFold payment
 * 4. Creates Razorpay order
 * 5. Saves gatewayOrderId
 * 6. Changes PENDING → INITIATED
 */
router.post(
  "/:id/razorpay-order",
  authenticate,
  paymentController.createRazorpayOrder,
);

/**
 * Verify Razorpay payment
 *
 * POST /api/v1/payments/:id/verify
 *
 * Body:
 * {
 *   "razorpayPaymentId": "...",
 *   "razorpayOrderId": "...",
 *   "razorpaySignature": "..."
 * }
 *
 * Backend:
 *
 * 1. Finds the FreshFold payment
 * 2. Verifies payment ownership
 * 3. Verifies payment status
 * 4. Verifies Razorpay order ID
 * 5. Verifies Razorpay signature
 * 6. Marks payment as SUCCESS
 * 7. Updates Order.paymentStatus → PAID
 */
router.post(
  "/:id/verify",
  authenticate,
  paymentController.verifyRazorpayPayment,
);

/* -------------------------------------------------------------------------- */
/*                         LEGACY / MANUAL PAYMENT                            */
/* -------------------------------------------------------------------------- */

/**
 * Initiate payment
 *
 * PATCH /api/v1/payments/:id/initiate
 *
 * Existing/manual payment flow.
 *
 * NOTE:
 * The Razorpay flow should use:
 *
 * POST /api/v1/payments/:id/razorpay-order
 */
router.patch("/:id/initiate", authenticate, paymentController.initiatePayment);

/* -------------------------------------------------------------------------- */
/*                                ADMIN                                       */
/* -------------------------------------------------------------------------- */

/**
 * Mark payment as successful
 *
 * ADMIN ONLY
 *
 * Development/testing endpoint.
 *
 * PATCH /api/v1/payments/:id/success
 *
 * NOTE:
 * Production Razorpay payments should use:
 *
 * POST /api/v1/payments/:id/verify
 */
router.patch(
  "/:id/success",
  authenticate,
  authorize(UserRole.ADMIN),
  paymentController.markPaymentSuccess,
);

/**
 * Mark payment as failed
 *
 * ADMIN ONLY
 *
 * Development/testing endpoint.
 *
 * PATCH /api/v1/payments/:id/fail
 */
router.patch(
  "/:id/fail",
  authenticate,
  authorize(UserRole.ADMIN),
  paymentController.markPaymentFailed,
);

/* -------------------------------------------------------------------------- */
/*                              CUSTOMER                                      */
/* -------------------------------------------------------------------------- */

/**
 * Get payment by ID
 *
 * GET /api/v1/payments/:id
 *
 * IMPORTANT:
 * Keep this route after the more specific routes above.
 */
router.get("/:id", authenticate, paymentController.getById);

export default router;
