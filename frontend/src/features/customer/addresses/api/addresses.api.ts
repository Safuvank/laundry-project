import { api } from "@/lib/api/axios";

import type {
  Address,
  AddressResponse,
  AddressesResponse,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types/address.types";

/**
 * Get My Addresses
 */
export const getMyAddresses = async (): Promise<Address[]> => {
  const response = await api.get<AddressesResponse>(
    "/addresses/me",
  );

  return response.data.data;
};

/**
 * Get Address By ID
 */
export const getAddressById = async (
  addressId: string,
): Promise<Address> => {
  const response = await api.get<AddressResponse>(
    `/addresses/${addressId}`,
  );

  return response.data.data;
};

/**
 * Create Address
 */
export const createAddress = async (
  payload: CreateAddressPayload,
): Promise<Address> => {
  const response = await api.post<AddressResponse>(
    "/addresses",
    payload,
  );

  return response.data.data;
};

/**
 * Update Address
 */
export const updateAddress = async (
  addressId: string,
  payload: UpdateAddressPayload,
): Promise<Address> => {
  const response = await api.patch<AddressResponse>(
    `/addresses/${addressId}`,
    payload,
  );

  return response.data.data;
};

/**
 * Delete / Deactivate Address
 */
export const deleteAddress = async (
  addressId: string,
): Promise<Address> => {
  const response = await api.delete<AddressResponse>(
    `/addresses/${addressId}`,
  );

  return response.data.data;
};
