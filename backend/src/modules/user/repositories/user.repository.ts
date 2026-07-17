import { User } from "../../auth/models/user.model.js";

import type { IUser } from "../../auth/interfaces/IUser.js";

export class UserRepository {
  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  async findById(userId: string) {
    return User.findById(userId);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  async updateProfile(userId: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
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
       returnDocument: "after",
      },
    );
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
       returnDocument: "after",
      },
    );
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
        returnDocument: "after",
      },
    );
  }
}

export const userRepository = new UserRepository();
