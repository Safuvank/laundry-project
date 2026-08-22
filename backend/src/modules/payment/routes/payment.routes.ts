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
 * Create payment
 *
 * POST /api/v1/payments
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

/**
 * Initiate payment
 *
 * PATCH /api/v1/payments/:id/initiate
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
 */
router.get("/:id", authenticate, paymentController.getById);

export default router;
