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

import { EmailVerification } from "../models/emailVerification.model.js";

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

  // verify email
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
    // 1. Find user
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // 3. Check email verification
    if (!user.isEmailVerified) {
      throw new UnauthorizedError(
        "Please verify your email before logging in.",
      );
    }

    // 4. Check account status
    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Your account is not active.");
    }
    // 4. Check account status
// if (user.accountStatus === "SUSPENDED") {
//   throw new UnauthorizedError(
//     "Your account has been suspended. Please contact support."
//   );
// }


    // 5. Generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    // 6. Generate refresh token
    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // 7. Store refresh token
    await authRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // 8. Update last login
    await authRepository.updateUser(user.id, {
      lastLoginAt: new Date(),
    });

    // 9. Return data
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  /*
   * FORGOT PASSWORD
   */
  async forgotPassword(email: string) {
    // 1. Find the user
    const user = await authRepository.findUserByEmail(email);

    // 2. Prevent email enumeration
    if (!user) {
      return {
        message: "If an account exists, a password reset email has been sent.",
      };
    }

    // 3. Generate reset token
    const resetToken = generateToken();

    // 4. Store reset token
    await authRepository.createPasswordReset({
      userId: user.id,
      token: resetToken,
    });

    // 5. Generate reset URL
    const resetPasswordUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 6. Send reset email
    await emailService.sendForgotPasswordEmail({
      firstName: user.firstName,
      email: user.email,
      resetPasswordUrl,
    });

    // 7. Return success
    return {
      message: "If an account exists, a password reset email has been sent.",
    };
  }

  /*
   * RESET PASSWORD
   */
  async resetPassword(token: string, password: string) {
    // Find reset token
    const passwordReset = await authRepository.findPasswordReset(token);

    if (!passwordReset) {
      throw new ValidationError("Invalid or expired reset token");
    }

    // Check expiration
    if (passwordReset.expiresAt < new Date()) {
      throw new ValidationError("Reset link has expired");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Update user
    await authRepository.updateUser(passwordReset.userId.toString(), {
      password: hashedPassword,
    });

    // Delete reset token
    await authRepository.deletePasswordReset(token);

    return {
      message: "Password reset successfully.",
    };
  }

  //refresh token
  async refreshToken(refreshToken: string) {
    // 1. Verify JWT
    verifyRefreshToken(refreshToken);

    // 2. Find active session
    const session = await authRepository.findRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // 3. Find user
    const user = await authRepository.findUserById(session.userId.toString());

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // 4. Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
    });

    // 5. Rotate refresh token
    await authRepository.deleteRefreshToken(refreshToken);

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    await authRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_MS),
    });

    // 6. Return tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  //Logout

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

  //logout all

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

  // me
  async me(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }
}

export const authService = new AuthService();
