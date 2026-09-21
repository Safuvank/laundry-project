import { Router } from "express";
import { laundryServiceController } from "../controllers/laundryService.controller.js";
import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";
import { validateRequest } from "../../../shared/middlewares/validateRequest.js";
import { UserRole } from "../../auth/constants/roles.js";
import { createLaundryServiceSchema } from "../validators/createLaundryService.validator.js";
import { updateLaundryServiceSchema } from "../validators/updateLaundryService.validator.js";
const router = Router();
/* -------------------------------------------------------------------------- */
/*                            Customer Routes                                 */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/v1/laundry-services
 * Get all active laundry services
 */
router.get("/", authenticate, laundryServiceController.getActiveServices);
/* -------------------------------------------------------------------------- */
/*                              Admin Routes                                  */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/v1/laundry-services/admin/all
 * Get all laundry services (Active + Inactive)
 *
 * IMPORTANT:
 * This route must come before "/:id"
 */
router.get("/admin/all", authenticate, authorize(UserRole.ADMIN), laundryServiceController.getAll);
/**
 * POST /api/v1/laundry-services
 * Create laundry service
 */
router.post("/", authenticate, authorize(UserRole.ADMIN), validateRequest(createLaundryServiceSchema), laundryServiceController.create);
/**
 * PATCH /api/v1/laundry-services/:id
 * Update laundry service
 */
router.patch("/:id", authenticate, authorize(UserRole.ADMIN), validateRequest(updateLaundryServiceSchema), laundryServiceController.update);
/**
 * PATCH /api/v1/laundry-services/:id/activate
 * Activate laundry service
 */
router.patch("/:id/activate", authenticate, authorize(UserRole.ADMIN), laundryServiceController.activate);
/**
 * PATCH /api/v1/laundry-services/:id/deactivate
 * Deactivate laundry service
 */
router.patch("/:id/deactivate", authenticate, authorize(UserRole.ADMIN), laundryServiceController.deactivate);
/**
 * GET /api/v1/laundry-services/:id
 * Get laundry service by id
 */
router.get("/:id", authenticate, authorize(UserRole.ADMIN), laundryServiceController.getById);
export default router;
//# sourceMappingURL=laundryService.routes.js.map