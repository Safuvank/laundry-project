import { api } from "@/lib/api/axios";

import type {
  TurnaroundPlan,
  TurnaroundPlansResponse,
} from "../types/turnaround-plan.types";

export const getTurnaroundPlans = async (): Promise<TurnaroundPlan[]> => {
  const response = await api.get<TurnaroundPlansResponse>("/turnaround-plans");

  return response.data.data;
};
