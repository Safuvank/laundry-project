import type { IUser } from "../interfaces/IUser.js";

import { User } from "../models/user.model.js";

import { RefreshToken } from "../models/refreshToken.model.js";

import { EmailVerification } from "../models/emailVerification.model.js";

import { PasswordReset } from "../models/passwordReset.model.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async findUserById(userId: string) {
    return User.findById(userId);
  }

  async createUser(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async updateUser(userId: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, data, {
      new: true,
    });
  }

  // async updateUser(
  //   userId: string,
  //   data: Partial<{ isEmailVerified: boolean }>,
  // ) {
  //   return User.findByIdAndUpdate(userId, data, {
  //     new: true,
  //   });
  // }

  async createRefreshToken(tokenData: any) {
    return RefreshToken.create(tokenData);
  }

  async findRefreshToken(token: string) {
    return RefreshToken.findOne({
      token,
    });
  }

  async deleteRefreshToken(token: string) {
    return RefreshToken.deleteOne({
      token,
    });
  }

  async deleteAllRefreshTokens(userId: string) {
    return RefreshToken.deleteMany({
      userId,
    });
  }

  // async createEmailVerification(data: {
  //   userId: string;
  //   token: string;
  //   expiresAt: Date;
  // }) {
  //   return EmailVerification.create(data);
  // }

  async createEmailVerification(data: { userId: string; token: string }) {
    return EmailVerification.create({
      ...data,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  async findEmailVerification(token: string) {
    return EmailVerification.findOne({
      token,
    });
  }

  async deleteEmailVerification(token: string) {
    return EmailVerification.deleteOne({
      token,
    });
  }

  // async createPasswordReset(data: any) {
  //   return PasswordReset.create(data);
  // }

  async createPasswordReset(data: { userId: string; token: string }) {
    await PasswordReset.deleteOne({
      userId: data.userId,
    });

    return PasswordReset.create({
      ...data,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
  }

  async findPasswordReset(token: string) {
    return PasswordReset.findOne({
      token,
    });
  }

  async deletePasswordReset(token: string) {
    return PasswordReset.deleteOne({
      token,
    });
  }
}

export const authRepository = new AuthRepository();
