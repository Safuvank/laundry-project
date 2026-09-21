import jwt from "jsonwebtoken";

import { authRepository } from "../respsitories/auth.repository.js";

import { hashPassword, comparePassword } from "../utils/hash.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { generateToken } from "../utils/tokens.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";

import { emailService } from "../../mail/mail.module.js";

import { env } from "../../../config/env.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

import { googleOAuthClient } from "../config/google.config.js";

import { UserRole } from "../constants/roles.js";

export class AuthService {
  /*
   * --------------------------------------------------------------------------
   * REGISTER
   * --------------------------------------------------------------------------
   */

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      if (existingUser.accountStatus === "SUSPENDED") {
        throw new ValidationError(
          "This account has been deactivated. Please restore your account or contact support.",
        );
      }

      throw new ValidationError("Email already exists.");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
      authProvider: "LOCAL",
      providerId: null,
    });

    const verificationToken = generateToken();

    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await authRepository.createEmailVerification({
      userId: user.id,
      token: verificationToken,
    });

    await emailService.sendVerificationEmail({
      firstName: user.firstName,
      email: user.email,
      verificationUrl,
    });

    return {
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * VERIFY EMAIL
   * --------------------------------------------------------------------------
   */

  async verifyEmail(token: string) {
    const verification = await authRepository.findEmailVerification(token);

    if (!verification) {
      throw new ValidationError("Invalid verification token");
    }

    await authRepository.updateUser(verification.userId.toString(), {
      isEmailVerified: true,
    });

    await authRepository.deleteEmailVerification(token);

    return {
      message: "Email verified successfully",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * CREATE AUTH SESSION
   *
   * Shared by:
   * - Local login
   * - Google login
   *
   * Generates:
   * - Access token
   * - Refresh token
   *
   * Stores refresh token in database.
   * --------------------------------------------------------------------------
   */

  private async createAuthSession(user: any) {
    if (!user) {
      throw new UnauthorizedError("Unable to create authentication session.");
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Your account is not active.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    await authRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_MS),
    });

    const updatedUser = await authRepository.updateUser(user.id, {
      lastLoginAt: new Date(),
    });

    const safeUser = updatedUser ?? {
      _id: user._id,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      authProvider: user.authProvider,
      providerId: user.providerId,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      accountStatus: user.accountStatus,
      profileImage: user.profileImage,
      lastLoginAt: new Date(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  /*
   * --------------------------------------------------------------------------
   * LOGIN
   *
   * LOCAL / EMAIL + PASSWORD LOGIN
   * --------------------------------------------------------------------------
   */

  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmailForLogin(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    /*
     * Google accounts do not have a local password.
     */
    if (user.authProvider === "GOOGLE" || !user.password) {
      throw new UnauthorizedError(
        "This account uses Google login. Please continue with Google.",
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(
        "Please verify your email before logging in.",
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Your account is not active.");
    }

    return this.createAuthSession(user);
  }

  /*
   * --------------------------------------------------------------------------
   * GOOGLE AUTHORIZATION URL
   * --------------------------------------------------------------------------
   *
   * This generates the Google OAuth consent/login URL.
   *
   * Browser flow:
   *
   * Frontend
   *    ↓
   * GET /api/v1/auth/google
   *    ↓
   * Backend
   *    ↓
   * Google
   */

  getGoogleAuthorizationUrl() {
    return googleOAuthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: ["openid", "email", "profile"],
    });
  }

  /*
   * --------------------------------------------------------------------------
   * GOOGLE CALLBACK
   * --------------------------------------------------------------------------
   *
   * Google redirects here after successful authentication.
   *
   * Steps:
   *
   * 1. Exchange authorization code for Google tokens.
   * 2. Verify Google's ID token.
   * 3. Read Google user information.
   * 4. Find existing Google account.
   * 5. Find existing email account.
   * 6. Create new Google account if necessary.
   * 7. Create FreshFold authentication session.
   */

  async googleCallback(code: string) {
    if (!code) {
      throw new UnauthorizedError("Google authorization code is required.");
    }

    /*
     * Exchange authorization code for Google tokens.
     */
    let tokens;

    try {
      const response = await googleOAuthClient.getToken(code);

      tokens = response.tokens;
    } catch (error) {
      console.error("Google token exchange failed:", error);

      throw new UnauthorizedError(
        "Unable to authenticate with Google. Please try again.",
      );
    }

    if (!tokens.id_token) {
      throw new UnauthorizedError(
        "Google authentication failed. ID token was not provided.",
      );
    }

    /*
     * Verify Google ID token.
     */
    let payload;

    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch (error) {
      console.error("Google ID token verification failed:", error);

      throw new UnauthorizedError(
        "Unable to verify your Google account. Please try again.",
      );
    }

    if (!payload) {
      throw new UnauthorizedError(
        "Unable to retrieve Google account information.",
      );
    }

    /*
     * Google provider ID.
     *
     * `sub` is Google's unique identifier for the user.
     */
    const providerId = payload.sub;

    if (!providerId) {
      throw new UnauthorizedError("Google account ID was not provided.");
    }

    /*
     * Google email.
     */
    const email = payload.email?.trim().toLowerCase();

    if (!email) {
      throw new UnauthorizedError("Google account email was not provided.");
    }

    /*
     * Google should verify the email.
     */
    if (!payload.email_verified) {
      throw new UnauthorizedError(
        "Your Google email address could not be verified.",
      );
    }

    /*
     * User profile information from Google.
     */
    const firstName =
      payload.given_name?.trim() ||
      payload.name?.split(" ")[0]?.trim() ||
      "User";

    const lastName =
      payload.family_name?.trim() ||
      payload.name?.split(" ").slice(1).join(" ").trim() ||
      "";

    const profileImage = payload.picture ?? null;

    /*
     * ------------------------------------------------------------------------
     * CASE 1
     *
     * Existing Google account.
     * ------------------------------------------------------------------------
     */

    let user = await authRepository.findUserByProviderId(providerId);

    if (user) {
      if (user.accountStatus === "SUSPENDED") {
        throw new UnauthorizedError(
          "This account has been suspended. Please contact support.",
        );
      }

      if (user.accountStatus !== "ACTIVE") {
        throw new UnauthorizedError("Your account is not active.");
      }

      /*
       * Update Google profile information.
       */
      user =
        (await authRepository.updateUser(user.id, {
          firstName,
          lastName,
          profileImage,
          isEmailVerified: true,
        })) ?? user;

      return this.createAuthSession(user);
    }

    /*
     * ------------------------------------------------------------------------
     * CASE 2
     *
     * Existing FreshFold account with same email.
     *
     * We do NOT automatically link Google to an existing LOCAL account.
     *
     * This prevents accidental account linking.
     * ------------------------------------------------------------------------
     */

    const existingEmailUser = await authRepository.findUserByEmail(email);

    if (existingEmailUser) {
      if (existingEmailUser.authProvider === "LOCAL") {
        throw new ValidationError(
          "An account with this email already exists. Please sign in using your email and password.",
        );
      }

      /*
       * Unexpected provider state.
       */
      throw new ValidationError(
        "An account with this email already exists. Please use the original sign-in method.",
      );
    }

    /*
     * ------------------------------------------------------------------------
     * CASE 3
     *
     * Create a new Google account.
     * ------------------------------------------------------------------------
     */

    user = await authRepository.createUser({
      firstName,
      lastName,
      email,
      phoneNumber: null,
      authProvider: "GOOGLE",
      providerId,
      role: UserRole.USER,
      isEmailVerified: true,
      accountStatus: "ACTIVE",
      profileImage,
      lastLoginAt: new Date(),
    });

    /*
     * Create FreshFold authentication session.
     */
    return this.createAuthSession(user);
  }

  /*
   * --------------------------------------------------------------------------
   * FORGOT PASSWORD
   * --------------------------------------------------------------------------
   */

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);

    /*
     * Always return the same response when the account
     * does not exist.
     */
    if (!user) {
      return {
        message: "If an account exists, a password reset email has been sent.",
      };
    }

    /*
     * Google accounts do not have a local password.
     */
    if (user.authProvider === "GOOGLE" || !user.password) {
      return {
        message: "If an account exists, a password reset email has been sent.",
      };
    }

    const resetToken = generateToken();

    await authRepository.createPasswordReset({
      userId: user.id,
      token: resetToken,
    });

    const resetPasswordUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailService.sendForgotPasswordEmail({
      firstName: user.firstName,
      email: user.email,
      resetPasswordUrl,
    });

    return {
      message: "If an account exists, a password reset email has been sent.",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * RESET PASSWORD
   * --------------------------------------------------------------------------
   */

  async resetPassword(token: string, password: string) {
    const passwordReset = await authRepository.findPasswordReset(token);

    if (!passwordReset) {
      throw new ValidationError("Invalid or expired reset token");
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new ValidationError("Reset link has expired");
    }

    const user = await authRepository.findUserById(
      passwordReset.userId.toString(),
    );

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    /*
     * Google accounts should continue using Google authentication.
     */
    if (user.authProvider === "GOOGLE" || !user.password) {
      throw new ValidationError(
        "This account uses Google login. Password reset is not available.",
      );
    }

    const hashedPassword = await hashPassword(password);

    await authRepository.updateUser(user.id, {
      password: hashedPassword,
    });

    /*
     * Remove used reset token.
     */
    await authRepository.deletePasswordReset(token);

    /*
     * Invalidate all existing sessions after password reset.
     */
    await authRepository.deleteAllRefreshTokens(user.id);

    return {
      message: "Password reset successfully.",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * REFRESH TOKEN
   * --------------------------------------------------------------------------
   */

  async refreshToken(refreshToken: string) {
    /*
     * Validate token exists.
     */
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    /*
     * Verify JWT.
     */
    try {
      verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Refresh token has expired.");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token.");
      }

      throw error;
    }

    /*
     * Find active session.
     */
    const session = await authRepository.findRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    /*
     * Find user.
     */
    const user = await authRepository.findUserById(session.userId.toString());

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    /*
     * Check account status.
     */
    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Account is inactive.");
    }

    /*
     * Generate new access token.
     */
    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    /*
     * Generate new refresh token.
     */
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
    });

    /*
     * Rotate refresh token.
     */
    await authRepository.deleteRefreshToken(refreshToken);

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    await authRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_MS),
    });

    /*
     * Return tokens.
     */
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /*
   * --------------------------------------------------------------------------
   * LOGOUT
   * --------------------------------------------------------------------------
   */

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    const existingToken = await authRepository.findRefreshToken(refreshToken);

    if (!existingToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    await authRepository.deleteRefreshToken(refreshToken);

    return {
      message: "Logged out successfully.",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * LOGOUT ALL
   * --------------------------------------------------------------------------
   */

  async logoutAll(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    await authRepository.deleteAllRefreshTokens(user.id);

    return {
      message: "Logged out from all devices successfully.",
    };
  }

  /*
   * --------------------------------------------------------------------------
   * ME
   * --------------------------------------------------------------------------
   */

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }
}

export const authService = new AuthService();
