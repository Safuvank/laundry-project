export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ----------------------------------
// Authentication User
// ----------------------------------

export interface AuthUser {
  _id: string;

  firstName: string;
  lastName: string;

  email: string;
  phoneNumber?: string;

  role: "USER" | "ADMIN" | "DELIVERY_AGENT";

  isEmailVerified: boolean;

  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";

  profileImage?: string | null;

  lastLoginAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

// ----------------------------------
// Login Response
// ----------------------------------

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    accessToken: string;
    user: AuthUser;
  };
}

// ----------------------------------
// Generic Auth Response
// ----------------------------------

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: unknown;
}