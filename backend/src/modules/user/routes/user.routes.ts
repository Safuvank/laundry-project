import { Router } from "express";

import { userController } from "../controllers/user.controller.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";

import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { updateProfileSchema } from "../validators/updateProfile.validator.js";

import { changePasswordSchema } from "../validators/changePassword.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get("/me", authenticate, userController.me);

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

router.patch(
  "/me",
  authenticate,
  validateRequest(updateProfileSchema),
  userController.updateProfile,
);

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-password",
  authenticate,
  validateRequest(changePasswordSchema),
  userController.changePassword,
);

/*
|--------------------------------------------------------------------------
| Update Profile Image
|--------------------------------------------------------------------------
*/

router.patch("/me/avatar", authenticate, userController.updateProfileImage);

/*
|--------------------------------------------------------------------------
| Delete Account
|--------------------------------------------------------------------------
*/

router.delete("/me", authenticate, userController.deleteAccount);

export default router;
