import { Router } from "express";

import { deliveryAssignmentController } from "../controllers/deliveryAssignment.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";

import { UserRole } from "../../auth/constants/roles.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                              ADMIN ROUTES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Create delivery assignment manually
 *
 * Admin only
 *
 * POST /api/v1/delivery-assignments
 *
 * Body:
 * {
 *   "orderId": "...",
 *   "deliveryAgentId": "...",
 *   "assignmentType": "PICKUP"
 * }
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.create,
);

/**
 * Automatically create delivery assignment
 *
 * Admin only
 *
 * Order must be:
 *
 * READY_FOR_DELIVERY
 *        ↓
 * Find available delivery agent within 5 km
 *        ↓
 * Create DELIVERY assignment
 *        ↓
 * OFFERED
 *
 * POST /api/v1/delivery-assignments/delivery
 *
 * Body:
 * {
 *   "orderId": "..."
 * }
 */
router.post(
  "/delivery",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.createDeliveryAssignment,
);

/**
 * Get all active assignments
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/active
 */
router.get(
  "/active",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getAllActive,
);

/**
 * Get assignments by status
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/status?status=OFFERED
 */
router.get(
  "/status",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getByStatus,
);

/**
 * Get assignments by order
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/order/:orderId
 */
router.get(
  "/order/:orderId",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getByOrderId,
);

/**
 * Get active assignment by order
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/order/:orderId/active
 */
router.get(
  "/order/:orderId/active",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getActiveByOrderId,
);

/**
 * Get assignments by delivery agent
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/agent/:deliveryAgentId
 */
router.get(
  "/agent/:deliveryAgentId",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getByAgentId,
);

/**
 * Get active assignment by delivery agent
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/agent/:deliveryAgentId/active
 */
router.get(
  "/agent/:deliveryAgentId/active",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getActiveByAgentId,
);

/* -------------------------------------------------------------------------- */
/*                          DELIVERY AGENT ROUTES                             */
/* -------------------------------------------------------------------------- */

/**
 * Accept assignment
 *
 * Delivery Agent only
 *
 * PATCH /api/v1/delivery-assignments/:id/accept
 */
router.patch(
  "/:id/accept",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAssignmentController.accept,
);

/**
 * Start pickup
 *
 * Delivery Agent only
 *
 * PICKUP_ASSIGNED
 *        ↓
 * OUT_FOR_PICKUP
 *
 * PATCH /api/v1/delivery-assignments/:id/start-pickup
 */
router.patch(
  "/:id/start-pickup",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAssignmentController.startPickup,
);

/**
 * Start delivery
 *
 * Delivery Agent only
 *
 * DELIVERY_ASSIGNED
 *        ↓
 * OUT_FOR_DELIVERY
 *
 * PATCH /api/v1/delivery-assignments/:id/start-delivery
 */
router.patch(
  "/:id/start-delivery",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAssignmentController.startDelivery,
);

/**
 * Reject assignment
 *
 * Delivery Agent only
 *
 * PATCH /api/v1/delivery-assignments/:id/reject
 */
router.patch(
  "/:id/reject",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAssignmentController.reject,
);

/**
 * Complete assignment
 *
 * Delivery Agent only
 *
 * PATCH /api/v1/delivery-assignments/:id/complete
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAssignmentController.complete,
);

/* -------------------------------------------------------------------------- */
/*                              ADMIN ACTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Cancel assignment
 *
 * Admin only
 *
 * PATCH /api/v1/delivery-assignments/:id/cancel
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.cancel,
);

/**
 * Get assignment by ID
 *
 * Admin only
 *
 * GET /api/v1/delivery-assignments/:id
 */
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAssignmentController.getById,
);

export default router;
