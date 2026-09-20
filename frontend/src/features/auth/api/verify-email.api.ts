import { api } from "@/lib/api/axios";

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

export const verifyEmail = async (
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  const response = await api.post<VerifyEmailResponse>(
    "/auth/verify-email",
    data,
  );

  return response.data;
};
