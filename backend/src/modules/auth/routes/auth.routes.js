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
/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
router.post("/register", validateRequest(registerSchema), authController.register);
/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
router.post("/login", validateRequest(loginSchema), authController.login);
/*
|--------------------------------------------------------------------------
| EMAIL VERIFICATION
|--------------------------------------------------------------------------
*/
router.post("/verify-email", validateRequest(verifyEmailSchema), authController.verifyEmail);
/*
|--------------------------------------------------------------------------
| PASSWORD RESET
|--------------------------------------------------------------------------
*/
router.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);
/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/
router.post("/refresh", authController.refreshToken);
/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/
router.get("/profile", authenticate, (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
});
router.get("/me", authenticate, authController.me);
/*
|--------------------------------------------------------------------------
| UPDATE CURRENT USER
|--------------------------------------------------------------------------
*/
router.patch("/me", authenticate, validateRequest(updateProfileSchema), userController.updateProfile);
/*
|--------------------------------------------------------------------------
| GOOGLE OAUTH
|--------------------------------------------------------------------------
|
| These routes will be added after the Google OAuth
| configuration, service, and controller are implemented.
|
| Planned routes:
|
| GET /google
| GET /google/callback
|
|--------------------------------------------------------------------------
*/
export default router;
//# sourceMappingURL=auth.routes.js.map