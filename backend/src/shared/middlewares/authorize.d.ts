import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../../modules/auth/constants/roles.js";
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map