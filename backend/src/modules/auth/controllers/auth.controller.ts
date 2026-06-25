import type { Request, Response } from "express";

import { authService } from "../services/auth.service.js";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
  console.log("LOGIN HIT");
  console.log(req.body);

  const { email, password } = req.body;

  const result = await authService.login(email, password);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});


verifyEmail = asyncHandler(
 async (req, res) => {

   const result =
    await authService.verifyEmail(
      req.body.token
    );

   return res.status(200).json({
     success: true,
     ...result
   });

 });
 
}

export const authController = new AuthController();
