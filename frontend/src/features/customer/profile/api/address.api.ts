import { api } from "@/lib/api/axios";

import type {
  AddressResponse,
  AddressesResponse,
  CreateAddressPayload,
  CustomerAddress,
  UpdateAddressPayload,
} from "../types/address.types";

/**
 * Get all active addresses belonging to the logged-in customer.
 */
export const getMyAddresses = async (): Promise<CustomerAddress[]> => {
  const response = await api.get<AddressesResponse>("/addresses/me");

  return response.data.data;
};

/**
 * Get a single address by ID.
 */
export const getAddressById = async (
  addressId: string,
): Promise<CustomerAddress> => {
  if (!addressId) {
    throw new Error("Address ID is required.");
  }

  const response = await api.get<AddressResponse>(`/addresses/${addressId}`);

  return response.data.data;
};

/**
 * Create a new customer address.
 */
export const createAddress = async (
  payload: CreateAddressPayload,
): Promise<CustomerAddress> => {
  const response = await api.post<AddressResponse>("/addresses", payload);

  return response.data.data;
};

/**
 * Update an existing customer address.
 */
export const updateAddress = async (
  addressId: string,
  payload: UpdateAddressPayload,
): Promise<CustomerAddress> => {
  if (!addressId) {
    throw new Error("Address ID is required.");
  }

  const response = await api.patch<AddressResponse>(
    `/addresses/${addressId}`,
    payload,
  );

  return response.data.data;
};

/**
 * Delete an address.
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  if (!addressId) {
    throw new Error("Address ID is required.");
  }

  await api.delete(`/addresses/${addressId}`);
};

/**
 * Set an address as the default address.
 */
export const setDefaultAddress = async (
  addressId: string,
): Promise<CustomerAddress> => {
  if (!addressId) {
    throw new Error("Address ID is required.");
  }

  const response = await api.patch<AddressResponse>(
    `/addresses/${addressId}/default`,
  );

  return response.data.data;
};
