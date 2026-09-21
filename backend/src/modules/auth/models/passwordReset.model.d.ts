import mongoose, { Types } from "mongoose";
export declare const PasswordReset: mongoose.Model<{
    userId: Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    token: string;
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
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: Types.ObjectId;
    token: string;
    expiresAt: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    token: string;
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
    expiresAt: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=passwordReset.model.d.ts.map