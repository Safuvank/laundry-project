import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";

import { registerSchema } from "../validators/register.validator.js";

import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { loginSchema } from "../validators/login.validator.js";

import { verifyEmailSchema } from "../validators/verifyEmail.validator.js";

import { forgotPasswordSchema } from "../validators/forgotPassword.validator.js";

import { resetPasswordSchema } from "../validators/resetPassword.validator.js";

import { authenticate } from "../../../shared/middlewares/authenticate.js";

import { updateProfileSchema } from "../../user/validators/updateProfile.validator.js";

import { userController } from "../../user/controllers/user.controller.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

router.post("/login", validateRequest(loginSchema), authController.login);

router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  authController.verifyEmail,
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);

// router.post("/refresh", authController.refreshToken);
router.post("/refresh", authController.refreshToken.bind(authController));

router.post("/logout", authController.logout);

router.post("/logout-all", authController.logoutAll);

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.get("/me", authenticate, authController.me);

router.patch(
  "/me",
  authenticate,
  validateRequest(updateProfileSchema),
  userController.updateProfile,
);

export default router;
