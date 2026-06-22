import { Document } from "mongoose";
import { UserRole } from "../constants/roles.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  phoneNumber: string | null;

  role: UserRole;

  isEmailVerified: boolean;

  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";

  profileImage: string | null;

  lastLoginAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
