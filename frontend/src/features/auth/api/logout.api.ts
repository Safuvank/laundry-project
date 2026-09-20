import { api } from "@/lib/api/axios";

export interface LogoutResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/auth/logout");

  return response.data;
};
