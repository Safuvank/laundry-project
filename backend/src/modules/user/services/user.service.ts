import { userRepository } from "../repositories/user.repository.js";

import { authRepository } from "../../auth/respsitories/auth.repository.js";

import { comparePassword, hashPassword } from "../../auth/utils/hash.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class UserService {
  /*
  |--------------------------------------------------------------------------
  | Private Helper
  |--------------------------------------------------------------------------
  */

  private async getUserOrFail(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Current User
  |--------------------------------------------------------------------------
  */

  async me(userId: string) {
    const user = await this.getUserOrFail(userId);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    },
  ) {
    await this.getUserOrFail(userId);

    const updateData: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    } = {};

    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName;
    }

    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber;
    }

    const updatedUser = await userRepository.updateProfile(userId, updateData);

    return updatedUser;
  }

  /*
  |--------------------------------------------------------------------------
  | Change Password
  |--------------------------------------------------------------------------
  */

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.getUserOrFail(userId);

    if (currentPassword === newPassword) {
      throw new ValidationError(
        "New password must be different from current password.",
      );
    }

    const isPasswordCorrect = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Current password is incorrect.");
    }

    const hashedPassword = await hashPassword(newPassword);

    await userRepository.updatePassword(userId, hashedPassword);

    /*
    |--------------------------------------------------------------------------
    | Security
    | Logout user from all devices after password change
    |--------------------------------------------------------------------------
    */

    await authRepository.deleteAllRefreshTokens(userId);

    return {
      message: "Password changed successfully. Please login again.",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Profile Image
  |--------------------------------------------------------------------------
  */

  async updateProfileImage(userId: string, imageUrl: string) {
    await this.getUserOrFail(userId);

    const updatedUser = await userRepository.updateProfileImage(
      userId,
      imageUrl,
    );

    return updatedUser;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Account (Soft Delete)
  |--------------------------------------------------------------------------
  */

  async deleteAccount(userId: string) {
    await this.getUserOrFail(userId);

    await userRepository.softDelete(userId);

    /*
    |--------------------------------------------------------------------------
    | Destroy all sessions
    |--------------------------------------------------------------------------
    */

    await authRepository.deleteAllRefreshTokens(userId);

    return {
      message: "Account deleted successfully.",
    };
  }
}

export const userService = new UserService();
