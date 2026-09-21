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

/* -------------------------------------------------------------------------- */
/*                              AUTH USER                                     */
/* -------------------------------------------------------------------------- */

export interface AuthUser {
  _id: string;

  firstName: string;
  lastName: string;

  email: string;

  phoneNumber: string | null;

  /*
   * Authentication provider.
   *
   * LOCAL  → email/password
   * GOOGLE → Google OAuth
   */
  authProvider: "LOCAL" | "GOOGLE";

  /*
   * Google `sub` value for Google accounts.
   *
   * LOCAL accounts have null.
   */
  providerId: string | null;

  role: "USER" | "ADMIN" | "DELIVERY_AGENT";

  isEmailVerified: boolean;

  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";

  profileImage: string | null;

  lastLoginAt: string | null;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                              LOGIN RESPONSE                                */
/* -------------------------------------------------------------------------- */

export interface LoginResponse {
  success: boolean;

  message: string;

  data: {
    accessToken: string;
    user: AuthUser;
  };
}

/* -------------------------------------------------------------------------- */
/*                              ME RESPONSE                                   */
/* -------------------------------------------------------------------------- */

export interface MeResponse {
  success: boolean;

  data: AuthUser;
}

/* -------------------------------------------------------------------------- */
/*                         REFRESH TOKEN RESPONSE                             */
/* -------------------------------------------------------------------------- */

export interface RefreshTokenResponse {
  success: boolean;

  message: string;

  data: {
    accessToken: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                            GENERIC RESPONSE                                */
/* -------------------------------------------------------------------------- */

export interface AuthResponse {
  success: boolean;

  message: string;

  data?: unknown;
}