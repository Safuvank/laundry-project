import { Router } from "express";

import { orderController } from "../controllers/order.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";

import { authorize } from "../../../shared/middlewares/authorize.js";

import { UserRole } from "../../auth/constants/roles.js";

import { updateOrderStatusSchema } from "../validators/updateOrderStatus.validator.js";

import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { updateOrderPricingSchema } from "../validators/updateOrderPricing.validator.js";

import { updatePaymentStatusSchema } from "../validators/updatePaymentStatus.validator.js";

import { createOrderSchema } from "../validators/createOrder.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validateRequest(createOrderSchema),
  orderController.create,
);

router.get("/my-orders", authenticate, orderController.getMyOrders);

router.get("/:id", authenticate, orderController.getById);

router.patch("/:id/cancel", authenticate, orderController.cancel);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

/**
 * Get all orders
 *
 * Admin only
 *
 * GET /api/v1/orders
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.getAll,
);

/**
 * Update order status
 *
 * Admin only
 *
 * PATCH /api/v1/orders/:id/status
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updateOrderStatusSchema),
  orderController.updateStatus,
);

/**
 * Mark order as received at facility
 *
 * Admin only
 *
 * PICKED_UP
 *     ↓
 * RECEIVED_AT_FACILITY
 *
 * PATCH /api/v1/orders/:id/received-at-facility
 */
router.patch(
  "/:id/received-at-facility",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.markReceivedAtFacility,
);

/**
 * Start order inspection
 *
 * Admin only
 *
 * RECEIVED_AT_FACILITY
 *          ↓
 * INSPECTION_IN_PROGRESS
 *
 * PATCH /api/v1/orders/:id/start-inspection
 */
router.patch(
  "/:id/start-inspection",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.startInspection,
);

/**
 * Update order pricing
 *
 * Admin only
 *
 * INSPECTION_IN_PROGRESS
 *          ↓
 * PRICE_FINALIZED
 *
 * PATCH /api/v1/orders/:id/pricing
 */
router.patch(
  "/:id/pricing",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updateOrderPricingSchema),
  orderController.updatePricing,
);

/**
 * Request customer approval
 *
 * Admin only
 *
 * PRICE_FINALIZED
 *          ↓
 * CUSTOMER_APPROVAL_PENDING
 *
 * PATCH /api/v1/orders/:id/request-approval
 */
router.patch(
  "/:id/request-approval",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.requestCustomerApproval,
);

/*
|--------------------------------------------------------------------------
| Customer Price Approval
|--------------------------------------------------------------------------
*/

/**
 * Approve final price
 *
 * Customer only
 *
 * CUSTOMER_APPROVAL_PENDING
 *          ↓
 * PROCESSING
 *
 * PATCH /api/v1/orders/:id/approve-price
 */
router.patch("/:id/approve-price", authenticate, orderController.approvePrice);

/**
 * Reject final price
 *
 * Customer only
 *
 * CUSTOMER_APPROVAL_PENDING
 *          ↓
 * ON_HOLD
 *
 * PATCH /api/v1/orders/:id/reject-price
 */
router.patch("/:id/reject-price", authenticate, orderController.rejectPrice);

/*
|--------------------------------------------------------------------------
| Quality Check
|--------------------------------------------------------------------------
*/

/**
 * Start quality check
 *
 * Admin only
 *
 * PROCESSING
 *     ↓
 * QUALITY_CHECK
 *
 * PATCH /api/v1/orders/:id/start-quality-check
 */
router.patch(
  "/:id/start-quality-check",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.startQualityCheck,
);

/**
 * Complete quality check
 *
 * Admin only
 *
 * QUALITY_CHECK
 *     ↓
 * READY_FOR_DELIVERY
 *
 * PATCH /api/v1/orders/:id/complete-quality-check
 */
router.patch(
  "/:id/complete-quality-check",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.completeQualityCheck,
);

/*
|--------------------------------------------------------------------------
| Delivery Completion
|--------------------------------------------------------------------------
*/

/**
 * Complete order
 *
 * Admin only
 *
 * DELIVERED
 *     ↓
 * COMPLETED
 *
 * PATCH /api/v1/orders/:id/complete
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorize(UserRole.ADMIN),
  orderController.completeOrder,
);

/*
|--------------------------------------------------------------------------
| Payment
|--------------------------------------------------------------------------
*/

/**
 * Update payment status
 *
 * Admin only
 *
 * PATCH /api/v1/orders/:id/payment-status
 */
router.patch(
  "/:id/payment-status",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updatePaymentStatusSchema),
  orderController.updatePaymentStatus,
);

export default router;
