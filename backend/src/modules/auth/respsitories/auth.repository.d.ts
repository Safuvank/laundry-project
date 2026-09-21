import type { IUser } from "../interfaces/IUser.js";
export declare class AuthRepository {
    findUserByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findUserByProviderId(providerId: string): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findUserByEmailForLogin(email: string): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findUserById(userId: string): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createUser(userData: Partial<IUser>): Promise<import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateUser(userId: string, data: Partial<IUser>): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createRefreshToken(data: {
        userId: string;
        token: string;
        expiresAt: Date;
    }): Promise<import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        deviceInfo: string;
        ipAddress: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        deviceInfo: string;
        ipAddress: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    findRefreshToken(token: string): Promise<(import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        deviceInfo: string;
        ipAddress: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        deviceInfo: string;
        ipAddress: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null>;
    deleteRefreshToken(token: string): Promise<import("mongodb").DeleteResult>;
    deleteAllRefreshTokens(userId: string): Promise<import("mongodb").DeleteResult>;
    createEmailVerification(data: {
        userId: string;
        token: string;
    }): Promise<import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    findEmailVerification(token: string): Promise<(import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null>;
    deleteEmailVerification(token: string): Promise<import("mongodb").DeleteResult>;
    createPasswordReset(data: {
        userId: string;
        token: string;
    }): Promise<import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    findPasswordReset(token: string): Promise<(import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        token: string;
        expiresAt: NativeDate;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null>;
    deletePasswordReset(token: string): Promise<import("mongodb").DeleteResult>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map