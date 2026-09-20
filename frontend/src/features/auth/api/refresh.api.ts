import { api } from "@/lib/api/axios";

interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export const refreshAccessToken = async (): Promise<string> => {
  const response = await api.post<RefreshResponse>("/auth/refresh");

  return response.data.data.accessToken;
};
