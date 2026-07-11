// import "express";
// import { UserRole } from "../../modules/auth/constants/roles.js";

// export declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userId: string;
//         role: UserRole;
//       };
//     }
//   }
// }


import "express";
import { UserRole } from "../modules/auth/constants/roles.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export {};