import { Router } from "express";

import { addressController } from "../controllers/address.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { createAddressSchema } from "../validators/createAddress.validator.js";
import { updateAddressSchema } from "../validators/updateAddress.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Protect All Routes
|--------------------------------------------------------------------------
*/

router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Address Routes
|--------------------------------------------------------------------------
*/

// Create Address
router.post(
  "/",
  validateRequest(createAddressSchema),
  addressController.create,
);

// Get All Addresses
router.get("/", addressController.getAll);

// Get Address By Id
router.get("/:id", addressController.getById);

// Update Address
router.patch(
  "/:id",
  validateRequest(updateAddressSchema),
  addressController.update,
);

// Delete Address
router.delete("/:id", addressController.delete);

// Set Default Address
router.patch("/:id/default", addressController.setDefault);

export default router;
