import { authRepository } from "../respsitories/auth.repository.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hash.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

import { generateToken } from "../utils/tokens.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";

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
    const existingUser =
      await authRepository.findUserByEmail(
        data.email
      );

    if (existingUser) {
      throw new ValidationError(
        "Email already exists"
      );
    }

    const hashedPassword =
      await hashPassword(data.password);

    const user =
      await authRepository.createUser({
        ...data,
        password: hashedPassword,
      });

    const verificationToken =
      generateToken();

    return {
      user,
      verificationToken,
    };
  }

  /*
   * LOGIN
   */
  async login(
    email: string,
    password: string
  ) {
    const user =
      await authRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new UnauthorizedError(
        "Invalid credentials"
      );
    }

    const isPasswordValid =
      await comparePassword(
        password,
        user.password
      );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        "Invalid credentials"
      );
    }

    const accessToken =
      generateAccessToken({
        userId: user.id,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        userId: user.id,
      });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

export const authService =
  new AuthService();