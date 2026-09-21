import { UserRole } from "../../modules/auth/constants/roles.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
// export const authorize =
//   (...roles: UserRole[]) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return next(new ForbiddenError("Access denied."));
//     }
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ForbiddenError(
//           "You do not have permission to perform this action.",
//         ),
//       );
//     }
//     next();
//   };
export const authorize = (...roles) => (req, res, next) => {
    console.log("Authorization check:");
    console.log("User role:", req.user?.role);
    console.log("Allowed roles:", roles);
    if (!req.user) {
        return next(new ForbiddenError("Access denied."));
    }
    if (!roles.includes(req.user.role)) {
        return next(new ForbiddenError("You do not have permission to perform this action."));
    }
    next();
};
//# sourceMappingURL=authorize.js.map