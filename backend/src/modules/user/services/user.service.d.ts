export declare class UserService {
    private getUserOrFail;
    me(userId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
        authProvider: "LOCAL" | "GOOGLE";
        role: import("../../auth/constants/roles.js").UserRole;
        profileImage: string | null;
        isEmailVerified: boolean;
        accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../auth/interfaces/IUser.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    updateProfileImage(userId: string, imageUrl: string): Promise<(import("mongoose").Document<unknown, {}, import("../../auth/interfaces/IUser.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map