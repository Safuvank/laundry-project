import { authRepository } from "../respsitories/auth.repository.js";

import { hashPassword, comparePassword } from "../utils/hash.js";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

import { generateToken } from "../utils/tokens.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";

import { EmailVerification } from "../models/emailVerification.model.js";

import { emailService } from "../../mail/mail.module.js";

import { env } from "../../../config/env.js";

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
      throw new ValidationError("Email already exists");
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
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

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
}

export const authService = new AuthService();
