import { User } from "../../auth/models/user.model.js";

import type { IUser } from "../../auth/interfaces/IUser.js";

export class UserRepository {
  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  async create(data: Partial<IUser>) {
    return User.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Find User By Email
  |--------------------------------------------------------------------------
  */

  async findByEmail(email: string) {
    return User.findOne({
      email: email.toLowerCase().trim(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find User By ID
  |--------------------------------------------------------------------------
  */

  async findById(userId: string) {
    return User.findById(userId).select("-password");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  async updateProfile(userId: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Password
  |--------------------------------------------------------------------------
  */

  async updatePassword(userId: string, password: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        password,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Profile Image
  |--------------------------------------------------------------------------
  */

  async updateProfileImage(userId: string, profileImage: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        profileImage,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete Account
  |--------------------------------------------------------------------------
  */

  async softDelete(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        accountStatus: "SUSPENDED",
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");
  }
}

export const userRepository = new UserRepository();
