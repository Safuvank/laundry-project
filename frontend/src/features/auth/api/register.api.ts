

import { api } from "@/lib/api/axios";
import type { RegisterRequest } from "../types/auth.types";

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {

  try {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      data
    );


    return response.data;
  } catch (error) {
    console.error("❌ REGISTER API ERROR:", error);

    throw error;
  }
};