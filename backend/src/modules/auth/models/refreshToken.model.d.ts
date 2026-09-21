import mongoose, { Types } from "mongoose";
export declare const RefreshToken: mongoose.Model<{
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: Types.ObjectId;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    expiresAt: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=refreshToken.model.d.ts.map