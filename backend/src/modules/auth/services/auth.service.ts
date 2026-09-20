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

export class AuthService {
  /*
   * REGISTER
   */
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
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
   * VERIFY EMAIL
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
   * LOGIN
   */
  async login(email: string, password: string) {
    console.log("🔐 LOGIN ATTEMPT:", email);

    const user = await authRepository.findUserByEmailForLogin(email);

    console.log("👤 USER FOUND:", !!user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    console.log("🔑 PASSWORD VALID:", isPasswordValid);
    console.log("📧 EMAIL VERIFIED:", user.isEmailVerified);
    console.log("🟢 ACCOUNT STATUS:", user.accountStatus);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isEmailVerified) {
      console.log("❌ EMAIL NOT VERIFIED");

      throw new UnauthorizedError(
        "Please verify your email before logging in.",
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      console.log("❌ ACCOUNT NOT ACTIVE");

      throw new UnauthorizedError("Your account is not active.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    await authRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await authRepository.updateUser(user.id, {
      lastLoginAt: new Date(),
    });

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      accountStatus: user.accountStatus,
      profileImage: user.profileImage,
      lastLoginAt: user.lastLoginAt,
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
   * FORGOT PASSWORD
   */
  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
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
   * RESET PASSWORD
   */
  async resetPassword(token: string, password: string) {
    const passwordReset = await authRepository.findPasswordReset(token);

    if (!passwordReset) {
      throw new ValidationError("Invalid or expired reset token");
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new ValidationError("Reset link has expired");
    }

    const hashedPassword = await hashPassword(password);

    await authRepository.updateUser(passwordReset.userId.toString(), {
      password: hashedPassword,
    });

    await authRepository.deletePasswordReset(token);

    return {
      message: "Password reset successfully.",
    };
  }

  /*
   * REFRESH TOKEN
   */
  async refreshToken(refreshToken: string) {
    /* ---------------------------------------------------------------------- */
    /*                         VALIDATE TOKEN                                  */
    /* ---------------------------------------------------------------------- */

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    /* ---------------------------------------------------------------------- */
    /*                         VERIFY JWT                                     */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /*                    FIND ACTIVE SESSION                                 */
    /* ---------------------------------------------------------------------- */

    const session = await authRepository.findRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    /* ---------------------------------------------------------------------- */
    /*                         FIND USER                                      */
    /* ---------------------------------------------------------------------- */

    const user = await authRepository.findUserById(session.userId.toString());

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    /* ---------------------------------------------------------------------- */
    /*                     CHECK ACCOUNT STATUS                               */
    /* ---------------------------------------------------------------------- */

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Account is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /*                       GENERATE TOKENS                                  */
    /* ---------------------------------------------------------------------- */

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
    });

    /* ---------------------------------------------------------------------- */
    /*                     ROTATE REFRESH TOKEN                               */
    /* ---------------------------------------------------------------------- */

    await authRepository.deleteRefreshToken(refreshToken);

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    await authRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_MS),
    });

    /* ---------------------------------------------------------------------- */
    /*                           RETURN TOKENS                                */
    /* ---------------------------------------------------------------------- */

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /*
   * LOGOUT
   */
  async logout(refreshToken: string) {
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
   * LOGOUT ALL
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
   * ME
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
