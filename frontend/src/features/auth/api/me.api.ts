import { api } from "@/lib/api/axios";

import type { AuthUser } from "../types/auth.types";

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

export const getMe = async (): Promise<AuthUser> => {
  const response = await api.get<MeResponse>("/auth/me");

  return response.data.data;
};
