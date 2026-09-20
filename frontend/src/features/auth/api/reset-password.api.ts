import { api } from "@/lib/api/axios";

export interface ResetPasswordRequest {
token: string;
password: string;
confirmPassword: string;
}

export interface ResetPasswordResponse {
success: boolean;
message: string;
data?: {
message: string;
};
}

export const resetPassword = async (
data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
const response = await api.post<ResetPasswordResponse>(
"/auth/reset-password",
data,
);

return response.data;
};
