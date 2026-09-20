import { api } from "@/lib/api/axios";

import type {
  ChangePasswordPayload,
  CustomerProfile,
  UpdateProfileImagePayload,
  UpdateProfilePayload,
} from "../types/profile.types";

interface ProfileResponse {
  success: boolean;
  message: string;
  data: CustomerProfile;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  const response = await api.get<ProfileResponse>("/users/me");

  return response.data.data;
};

export const updateCustomerProfile = async (
  payload: UpdateProfilePayload,
): Promise<CustomerProfile> => {
  const response = await api.patch<ProfileResponse>(
    "/users/me",
    payload,
  );

  return response.data.data;
};

export const updateProfileImage = async (
  payload: UpdateProfileImagePayload,
): Promise<CustomerProfile> => {
  const response = await api.patch<ProfileResponse>(
    "/users/me/avatar",
    payload,
  );

  return response.data.data;
};

export const changeCustomerPassword = async (
  payload: ChangePasswordPayload,
): Promise<string> => {
  const response = await api.patch<MessageResponse>(
    "/users/change-password",
    payload,
  );

  return response.data.message;
};