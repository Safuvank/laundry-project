import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { userService } from "../services/user.service.js";

export class UserController {
  /*
  |--------------------------------------------------------------------------
  | Get Current User
  |--------------------------------------------------------------------------
  */

  me = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await userService.me(userId);

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully.",
      data,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await userService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Change Password
  |--------------------------------------------------------------------------
  */

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { currentPassword, newPassword } = req.body;

    const data = await userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Update Profile Image
  |--------------------------------------------------------------------------
  */

  updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { profileImage } = req.body;

    const data = await userService.updateProfileImage(userId, profileImage);

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      data,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Delete Account
  |--------------------------------------------------------------------------
  */

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const data = await userService.deleteAccount(userId);

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  });
}

export const userController = new UserController();
