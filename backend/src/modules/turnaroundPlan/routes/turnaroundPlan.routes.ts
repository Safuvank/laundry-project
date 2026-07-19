import { Router } from "express";

import { turnaroundPlanController } from "../controllers/turnaroundPlan.controller.js";

import { createTurnaroundPlanSchema } from "../validators/createTurnaroundPlan.validator.js";
import { updateTurnaroundPlanSchema } from "../validators/updateTurnaroundPlan.validator.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";
import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { UserRole } from "../../auth/constants/roles.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all active turnaround plans
 *
 * GET /api/v1/turnaround-plans
 */
router.get("/", authenticate, turnaroundPlanController.getActivePlans);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all turnaround plans
 *
 * Includes:
 * - Active plans
 * - Inactive plans
 *
 * GET /api/v1/turnaround-plans/admin/all
 */
router.get(
  "/admin/all",
  authenticate,
  authorize(UserRole.ADMIN),
  turnaroundPlanController.getAll,
);

/**
 * Create turnaround plan
 *
 * POST /api/v1/turnaround-plans
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(createTurnaroundPlanSchema),
  turnaroundPlanController.create,
);

/**
 * Update turnaround plan
 *
 * PATCH /api/v1/turnaround-plans/:id
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updateTurnaroundPlanSchema),
  turnaroundPlanController.update,
);

/**
 * Activate turnaround plan
 *
 * PATCH /api/v1/turnaround-plans/:id/activate
 */
router.patch(
  "/:id/activate",
  authenticate,
  authorize(UserRole.ADMIN),
  turnaroundPlanController.activate,
);

/**
 * Deactivate turnaround plan
 *
 * PATCH /api/v1/turnaround-plans/:id/deactivate
 */
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(UserRole.ADMIN),
  turnaroundPlanController.deactivate,
);

/*
|--------------------------------------------------------------------------
| Dynamic ID Routes
|--------------------------------------------------------------------------
*/

/**
 * Get turnaround plan by ID
 *
 * GET /api/v1/turnaround-plans/:id
 */
router.get("/:id", authenticate, turnaroundPlanController.getById);

export default router;
