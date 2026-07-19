// import type { Request, Response, NextFunction } from "express";

// import { verifyAccessToken } from "../../modules/auth/utils/jwt.js";

// import { authRepository } from "../../modules/auth/respsitories/auth.repository.js";

// import { UnauthorizedError } from "../errors/UnauthorizedError.js";

// import { UserRole } from "../../modules/auth/constants/roles.js";

// export const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new UnauthorizedError("Access token is missing.");
//     }

//     // const token =
//     //   authHeader.split(" ")[1];

//     // const payload =
//     //   verifyAccessToken(token) as {
//     //     userId: string;
//     //     role: string;
//     //   };

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       throw new UnauthorizedError("Access token is missing.");
//     }

//     const payload = verifyAccessToken(token) as {
//       userId: string;
//       role: string;
//     };

//     const user = await authRepository.findUserById(payload.userId);

//     if (!user) {
//       throw new UnauthorizedError("User not found.");
//     }

//     if (user.accountStatus !== "ACTIVE") {
//       throw new UnauthorizedError("Account is inactive.");
//     }

//     req.user = {
//       userId: user.id,
//       role: UserRole,
//     };

//     next();
//   } catch (error) {
//     next(error);
//   }
// };



import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../../modules/auth/utils/jwt.js";
import { authRepository } from "../../modules/auth/respsitories/auth.repository.js";

import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { UserRole } from "../../modules/auth/constants/roles.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token is missing.");
    }

    const token = authHeader.substring(7); // Removes "Bearer "

    if (!token) {
      throw new UnauthorizedError("Access token is missing.");
    }

    const payload = verifyAccessToken(token) as {
      userId: string;
      role: UserRole;
    };

    const user = await authRepository.findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Account is inactive.");
    }

    req.user = {
      userId: user.id,
      role: user.role as UserRole,
    };

    next();
  } catch (error) {
    next(error);
  }
};