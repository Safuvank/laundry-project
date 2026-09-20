import { api } from "@/lib/api/axios";

export interface LogoutAllResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const logoutAll = async (): Promise<LogoutAllResponse> => {
  const response = await api.post<LogoutAllResponse>("/auth/logout-all");

  return response.data;
};