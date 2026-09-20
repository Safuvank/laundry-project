import { api } from "@/lib/api/axios";

import type {
  LaundryService,
  LaundryServicesResponse,
} from "../types/laundry-service.types";

export const getLaundryServices = async (): Promise<LaundryService[]> => {
  const response = await api.get<LaundryServicesResponse>("/laundry-services");

  return response.data.data;
};
