import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../../modules/auth/utils/jwt.js";
import { authRepository } from "../../modules/auth/respsitories/auth.repository.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { UserRole } from "../../modules/auth/constants/roles.js";
export const authenticate = async (req, _res, next) => {
    try {
        // ------------------------------------------------------------
        // 1. Get access token from Authorization header
        // ------------------------------------------------------------
        // ------------------------------------------------------------
        // DEBUG: Inspect incoming request headers
        // ------------------------------------------------------------
        console.log("======================================");
        console.log("AUTHENTICATE DEBUG");
        console.log("Method:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("Authorization header:", req.headers.authorization);
        console.log("All headers:", req.headers);
        console.log("======================================");
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedError("Access token is missing.");
        }
        const token = authHeader.substring(7);
        if (!token) {
            throw new UnauthorizedError("Access token is missing.");
        }
        // ------------------------------------------------------------
        // 2. Verify access token
        // ------------------------------------------------------------
        let payload;
        try {
            payload = verifyAccessToken(token);
        }
        catch (error) {
            // Access token has expired
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Access token has expired.");
            }
            // Access token is invalid
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError("Invalid access token.");
            }
            // Unknown JWT error
            throw error;
        }
        // ------------------------------------------------------------
        // 3. Find user
        // ------------------------------------------------------------
        const user = await authRepository.findUserById(payload.userId);
        if (!user) {
            throw new UnauthorizedError("User not found.");
        }
        // ------------------------------------------------------------
        // 4. Check account status
        // ------------------------------------------------------------
        if (user.accountStatus !== "ACTIVE") {
            throw new UnauthorizedError("Account is inactive.");
        }
        // ------------------------------------------------------------
        // 5. Attach authenticated user to request
        // ------------------------------------------------------------
        req.user = {
            userId: user.id,
            role: user.role,
        };
        // ------------------------------------------------------------
        // 6. Continue to controller
        // ------------------------------------------------------------
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=authenticate.js.map