import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";
import { refreshCookieOptions } from "../utils/cookies.js";
export class AuthController {
    /* -------------------------------------------------------------------------- */
    /*                                REGISTER                                    */
    /* -------------------------------------------------------------------------- */
    register = asyncHandler(async (req, res) => {
        const result = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                  LOGIN                                     */
    /* -------------------------------------------------------------------------- */
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.login(email, password);
        /*
         * Refresh token is stored in an HTTP-only cookie.
         *
         * The access token is returned in the response body
         * and can be stored by the frontend according to the
         * application's auth strategy.
         */
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user,
            },
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              GOOGLE LOGIN                                  */
    /* -------------------------------------------------------------------------- */
    googleLogin = asyncHandler(async (_req, res) => {
        /*
         * Generate Google's OAuth authorization URL.
         *
         * Browser:
         *
         * FreshFold
         *    ↓
         * /auth/google
         *    ↓
         * Google
         */
        const authorizationUrl = authService.getGoogleAuthorizationUrl();
        return res.redirect(authorizationUrl);
    });
    /* -------------------------------------------------------------------------- */
    /*                           GOOGLE CALLBACK                                  */
    /* -------------------------------------------------------------------------- */
    googleCallback = asyncHandler(async (req, res) => {
        const { code } = req.query;
        /*
         * Google must provide an authorization code.
         */
        if (typeof code !== "string" || !code) {
            throw new UnauthorizedError("Google authorization code is missing.");
        }
        /*
         * Exchange the Google authorization code for a
         * FreshFold authentication session.
         *
         * AuthService handles:
         *
         * - Google token exchange
         * - Google ID-token verification
         * - Finding existing Google users
         * - Creating new Google users
         * - Creating FreshFold access/refresh tokens
         */
        const { refreshToken } = await authService.googleCallback(code);
        /*
         * Store FreshFold refresh token in an HTTP-only cookie.
         *
         * The access token is intentionally NOT placed in
         * the URL.
         */
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        /*
         * Redirect to the frontend callback page.
         *
         * The frontend should call:
         *
         * POST /api/v1/auth/refresh
         *
         * after reaching this page.
         *
         * The browser automatically sends the HTTP-only
         * refresh-token cookie.
         */
        const redirectUrl = new URL("/auth/google/callback", envFrontendUrl());
        return res.redirect(redirectUrl.toString());
    });
    /* -------------------------------------------------------------------------- */
    /*                              VERIFY EMAIL                                  */
    /* -------------------------------------------------------------------------- */
    verifyEmail = asyncHandler(async (req, res) => {
        const result = await authService.verifyEmail(req.body.token);
        return res.status(200).json({
            success: true,
            ...result,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            FORGOT PASSWORD                                 */
    /* -------------------------------------------------------------------------- */
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            RESET PASSWORD                                  */
    /* -------------------------------------------------------------------------- */
    resetPassword = asyncHandler(async (req, res) => {
        const { token, password } = req.body;
        const result = await authService.resetPassword(token, password);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            REFRESH TOKEN                                   */
    /* -------------------------------------------------------------------------- */
    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token is required.");
        }
        const result = await authService.refreshToken(refreshToken);
        /*
         * Refresh-token rotation.
         *
         * Replace the old cookie with the newly generated
         * refresh token.
         */
        res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
            data: {
                accessToken: result.accessToken,
            },
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                  LOGOUT                                    */
    /* -------------------------------------------------------------------------- */
    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token is required.");
        }
        const result = await authService.logout(refreshToken);
        /*
         * Remove refresh token cookie from browser.
         */
        res.clearCookie("refreshToken", refreshCookieOptions);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              LOGOUT ALL                                    */
    /* -------------------------------------------------------------------------- */
    logoutAll = asyncHandler(async (req, res) => {
        /*
         * Never trust userId from req.body.
         *
         * authenticate middleware gets userId from the
         * verified access token.
         */
        const userId = req.user.userId;
        const result = await authService.logoutAll(userId);
        /*
         * Remove current browser refresh-token cookie.
         */
        res.clearCookie("refreshToken", refreshCookieOptions);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                    ME                                      */
    /* -------------------------------------------------------------------------- */
    me = asyncHandler(async (req, res) => {
        const user = await authService.me(req.user.userId);
        return res.status(200).json({
            success: true,
            data: user,
        });
    });
}
/*
 * --------------------------------------------------------------------------
 * FRONTEND URL
 * --------------------------------------------------------------------------
 *
 * Kept in one place so the Google callback does not directly access
 * process.env throughout the controller.
 *
 * FRONTEND_URL should be configured in .env.
 *
 * Example:
 *
 * FRONTEND_URL=http://localhost:3000
 */
const envFrontendUrl = () => {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        throw new Error("FRONTEND_URL is not configured.");
    }
    return frontendUrl;
};
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map