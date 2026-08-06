import { Router } from "express";

import { pricingController } from "../controllers/pricing.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";
import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { UserRole } from "../../auth/constants/roles.js";

import { createPricingSchema } from "../validators/createPricing.validator.js";
import { updatePricingSchema } from "../validators/updatePricing.validator.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                              Customer Routes                               */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/pricing
 * Get all active pricing rules
 */
router.get("/", authenticate, pricingController.getActivePricingRules);

/* -------------------------------------------------------------------------- */
/*                                Admin Routes                                */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/pricing/admin/all
 * Get all pricing rules
 *
 * IMPORTANT:
 * This route must come before "/:id"
 */
router.get(
  "/admin/all",
  authenticate,
  authorize(UserRole.ADMIN),
  pricingController.getAll,
);

/**
 * POST /api/v1/pricing
 * Create pricing rule
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(createPricingSchema),
  pricingController.create,
);

/**
 * PATCH /api/v1/pricing/:id
 * Update pricing rule
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updatePricingSchema),
  pricingController.update,
);

/**
 * PATCH /api/v1/pricing/:id/activate
 * Activate pricing rule
 */
router.patch(
  "/:id/activate",
  authenticate,
  authorize(UserRole.ADMIN),
  pricingController.activate,
);

/**
 * PATCH /api/v1/pricing/:id/deactivate
 * Deactivate pricing rule
 */
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(UserRole.ADMIN),
  pricingController.deactivate,
);

/**
 * GET /api/v1/pricing/:id
 * Get pricing rule by id
 */
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  pricingController.getById,
);

export default router;
