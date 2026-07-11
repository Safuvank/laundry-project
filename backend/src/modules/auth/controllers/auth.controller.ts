import type { Request, Response, NextFunction } from "express";

import { authService } from "../services/auth.service.js";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { refreshCookieOptions } from "../utils/cookies.js";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  });

  // login = asyncHandler(async (req: Request, res: Response) => {
  //   console.log("LOGIN HIT");
  //   console.log(req.body);

  //   const { email, password } = req.body;

  //   const result = await authService.login(email, password);

  //   return res.status(200).json({
  //     success: true,
  //     message: "Login successful",
  //     data: result,
  //   });
  // });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const result = await authService.verifyEmail(req.body.token);

    return res.status(200).json({
      success: true,
      ...result,
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  // refreshToken = asyncHandler(async (req: Request, res: Response) => {
  //   const { refreshToken } = req.body;

  //   const data = await authService.refreshToken(refreshToken);

  //   return res.status(200).json({
  //     success: true,
  //     message: "Token refreshed successfully.",
  //     data,
  //   });
  // });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshToken(refreshToken);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        accessToken: result.accessToken,
      },
    });
  });

  // logout = asyncHandler(async (req: Request, res: Response) => {
  //   const { refreshToken } = req.body;

  //   const data = await authService.logout(refreshToken);

  //   return res.status(200).json({
  //     success: true,
  //     message: data.message,
  //   });
  // });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const data = await authService.logoutAll(userId);

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  });
}

export const authController = new AuthController();
