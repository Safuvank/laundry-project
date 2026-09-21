import { Router } from "express";
import { pickupSlotController } from "../controllers/pickupSlot.controller.js";
import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";
import { validateRequest } from "../../../shared/middlewares/validateRequest.js";
import { UserRole } from "../../auth/constants/roles.js";
import { createPickupSlotSchema } from "../validators/createPickupSlot.validator.js";
import { updatePickupSlotSchema } from "../validators/updatePickupSlot.validator.js";
const router = Router();
/* -------------------------------------------------------------------------- */
/*                              Customer Routes                               */
/* -------------------------------------------------------------------------- */
/**
 * Get Available Pickup Slots
 */
router.get("/", authenticate, pickupSlotController.getAvailableSlots);
/**
 * Get Pickup Slots By Date
 * Example:
 * GET /api/v1/pickup-slots/date?date=2026-08-10
 */
router.get("/date", authenticate, pickupSlotController.getSlotsByDate);
/* -------------------------------------------------------------------------- */
/*                                Admin Routes                                */
/* -------------------------------------------------------------------------- */
/**
 * Get All Pickup Slots
 *
 * IMPORTANT:
 * Keep this before "/:id"
 */
router.get("/admin/all", authenticate, authorize(UserRole.ADMIN), pickupSlotController.getAll);
/**
 * Create Pickup Slot
 */
router.post("/", authenticate, authorize(UserRole.ADMIN), validateRequest(createPickupSlotSchema), pickupSlotController.create);
/**
 * Update Pickup Slot
 */
router.patch("/:id", authenticate, authorize(UserRole.ADMIN), validateRequest(updatePickupSlotSchema), pickupSlotController.update);
/**
 * Activate Pickup Slot
 */
router.patch("/:id/activate", authenticate, authorize(UserRole.ADMIN), pickupSlotController.activate);
/**
 * Deactivate Pickup Slot
 */
router.patch("/:id/deactivate", authenticate, authorize(UserRole.ADMIN), pickupSlotController.deactivate);
/**
 * Get Pickup Slot By ID
 */
router.get("/:id", authenticate, authorize(UserRole.ADMIN), pickupSlotController.getById);
export default router;
//# sourceMappingURL=pickupSlot.routes.js.map