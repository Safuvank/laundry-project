import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";

import { registerSchema } from "../validators/register.validator.js";

import { validateRequest } from "../../../shared/middlewares/validateRequest.js";

import { loginSchema } from "../validators/login.validator.js";

import { verifyEmailSchema } from "../validators/verifyEmail.validator.js";

const router = Router();

/*
 POST /api/v1/auth/register
*/

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

export default router;
