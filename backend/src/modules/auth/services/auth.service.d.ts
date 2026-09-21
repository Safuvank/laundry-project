export declare class AuthService {
    register(data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    private createAuthSession;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: (import("mongoose").Document<unknown, {}, import("../interfaces/IUser.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/IUser.js").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | {
            _id: any;
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            phoneNumber: any;
            authProvider: any;
            providerId: any;
            role: any;
            isEmailVerified: any;
            accountStatus: any;
            profileImage: any;
            lastLoginAt: Date;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    getGoogleAuthorizationUrl(): string;
    googleCallback(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: (import("mongoose").Document<unknown, {}, import("../interfaces/IUser.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/IUser.js").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | {
            _id: any;
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            phoneNumber: any;
            authProvider: any;
            providerId: any;
            role: any;
            isEmailVerified: any;
            accountStatus: any;
            profileImage: any;
            lastLoginAt: Date;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    me(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../interfaces/IUser.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/IUser.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map