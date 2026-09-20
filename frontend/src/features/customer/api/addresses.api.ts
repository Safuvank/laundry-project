import { api } from "@/lib/api/axios";

import type { Address, AddressesResponse } from "../types/address.types";

export const getMyAddresses = async (): Promise<Address[]> => {
  const response = await api.get<AddressesResponse>("/addresses/me");

  return response.data.data;
};
