import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { EmailVerification } from "../models/emailVerification.model.js";
import { PasswordReset } from "../models/passwordReset.model.js";
export class AuthRepository {
    /*
     * ==========================================================================
     * USER
     * ==========================================================================
     */
    /*
     * Find user by email.
     *
     * Used for:
     * - Registration
     * - Google OAuth email lookup
     * - Forgot password
     *
     * Email is normalized before querying.
     *
     * Password is NOT selected because the User model
     * excludes it by default.
     */
    async findUserByEmail(email) {
        return User.findOne({
            email: email.toLowerCase().trim(),
        });
    }
    /*
     * Find user by OAuth provider ID.
     *
     * Google provides a stable unique identifier called `sub`.
     *
     * Example:
     *
     * providerId = Google `sub`
     *
     * authProvider = GOOGLE
     *
     * This prevents duplicate Google accounts.
     */
    async findUserByProviderId(providerId) {
        return User.findOne({
            providerId,
            authProvider: "GOOGLE",
        });
    }
    /*
     * Find LOCAL user for email/password login.
     *
     * Password is excluded by default in the User model,
     * therefore we explicitly include it using:
     *
     * .select("+password")
     *
     * This method is used by AuthService.login().
     *
     * Google users can also be returned here, but AuthService
     * will reject them because they do not use password login.
     */
    async findUserByEmailForLogin(email) {
        return User.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");
    }
    /*
     * Find user by ID.
     *
     * Password is explicitly excluded.
     *
     * This method is used for:
     * - Refresh token
     * - Logout all
     * - /me
     * - Authenticated user lookup
     */
    async findUserById(userId) {
        return User.findById(userId).select("-password");
    }
    /*
     * Create User.
     *
     * Supports both:
     *
     * LOCAL:
     * {
     *   authProvider: "LOCAL",
     *   password: hashedPassword
     * }
     *
     * GOOGLE:
     * {
     *   authProvider: "GOOGLE",
     *   providerId: googleSub,
     *   password: undefined
     * }
     */
    async createUser(userData) {
        return User.create(userData);
    }
    /*
     * Update User.
     *
     * Important:
     * - new: true → return updated document
     * - runValidators: true → run Mongoose validators
     * - password excluded from returned document
     */
    async updateUser(userId, data) {
        return User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    /*
     * ==========================================================================
     * REFRESH TOKENS
     * ==========================================================================
     */
    /*
     * Create refresh-token session.
     *
     * Refresh tokens are stored in the database so that
     * sessions can be revoked individually or globally.
     */
    async createRefreshToken(data) {
        return RefreshToken.create(data);
    }
    /*
     * Find refresh-token session.
     */
    async findRefreshToken(token) {
        return RefreshToken.findOne({ token });
    }
    /*
     * Delete one refresh token.
     *
     * Used during:
     * - Logout
     * - Refresh-token rotation
     */
    async deleteRefreshToken(token) {
        return RefreshToken.deleteOne({ token });
    }
    /*
     * Delete all refresh tokens for a user.
     *
     * Used during:
     * - Logout from all devices
     * - Password reset
     */
    async deleteAllRefreshTokens(userId) {
        return RefreshToken.deleteMany({ userId });
    }
    /*
     * ==========================================================================
     * EMAIL VERIFICATION
     * ==========================================================================
     */
    /*
     * Create email verification token.
     *
     * Token expires after 24 hours.
     */
    async createEmailVerification(data) {
        return EmailVerification.create({
            ...data,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
    }
    /*
     * Find email verification token.
     */
    async findEmailVerification(token) {
        return EmailVerification.findOne({ token });
    }
    /*
     * Delete email verification token.
     *
     * Token is deleted after successful verification
     * so it cannot be reused.
     */
    async deleteEmailVerification(token) {
        return EmailVerification.deleteOne({ token });
    }
    /*
     * ==========================================================================
     * PASSWORD RESET
     * ==========================================================================
     */
    /*
     * Create password-reset token.
     *
     * Before creating a new token, remove previous reset
     * tokens for the same user.
     *
     * Token expires after 15 minutes.
     */
    async createPasswordReset(data) {
        await PasswordReset.deleteOne({
            userId: data.userId,
        });
        return PasswordReset.create({
            ...data,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });
    }
    /*
     * Find password-reset token.
     */
    async findPasswordReset(token) {
        return PasswordReset.findOne({ token });
    }
    /*
     * Delete password-reset token.
     *
     * Called after successful password reset.
     */
    async deletePasswordReset(token) {
        return PasswordReset.deleteOne({ token });
    }
}
export const authRepository = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map