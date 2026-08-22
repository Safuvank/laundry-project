// import type { Request, Response, NextFunction } from "express";

// import { UserRole } from "../../modules/auth/constants/roles.js";

// import { AuthorizationError } from "../errors/AuthorizationError.js";

// export const authorizeRole =
//   (...allowedRoles: UserRole[]) =>
//   (req: Request, _res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       throw new AuthorizationError("Authentication required.");
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       throw new AuthorizationError(
//         "You are not authorized to access this resource.",
//       );
//     }

//     next();
//   };
