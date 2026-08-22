import { Router } from "express";

import { deliveryAgentController } from "../controllers/deliveryAgent.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";

import { UserRole } from "../../auth/constants/roles.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                         DELIVERY AGENT PROFILE                             */
/* -------------------------------------------------------------------------- */

/**
 * Create delivery agent
 *
 * Admin only.
 *
 * Creates:
 * 1. User account with DELIVERY_AGENT role
 * 2. DeliveryAgent profile
 *
 * POST /api/v1/delivery-agents
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.create,
);

/**
 * Get logged-in delivery agent profile
 */
router.get(
  "/me",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAgentController.getMyProfile,
);

/**
 * Update logged-in delivery agent location
 */
router.patch(
  "/location",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAgentController.updateLocation,
);

/**
 * Update logged-in delivery agent status
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.DELIVERY_AGENT),
  deliveryAgentController.updateStatus,
);

/* -------------------------------------------------------------------------- */
/*                              NEARBY AGENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Find nearby available delivery agents
 *
 * Admin only.
 *
 * Example:
 * GET /api/v1/delivery-agents/nearby?longitude=75.7804&latitude=11.2588
 *
 * Default radius = 5000 meters.
 */
router.get(
  "/nearby",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.findNearbyAgents,
);

/* -------------------------------------------------------------------------- */
/*                              ADMIN ROUTES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get all delivery agents
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.getAll,
);

/**
 * Get all active delivery agents
 */
router.get(
  "/active",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.getAllActive,
);

/**
 * Get all available delivery agents
 */
router.get(
  "/available",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.getAvailableAgents,
);

/**
 * Update delivery agent profile
 *
 * Admin only.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.update,
);

/**
 * Activate delivery agent
 */
router.patch(
  "/:id/activate",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.activate,
);

/**
 * Deactivate delivery agent
 */
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.deactivate,
);

/**
 * Get delivery agent by ID
 *
 * Admin only.
 */
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  deliveryAgentController.getById,
);

export default router;
