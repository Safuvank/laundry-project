"use client";

import { useQuery } from "@tanstack/react-query";

import { getTurnaroundPlans } from "../api/turnaround-plans.api";

export const useTurnaroundPlans = () => {
  return useQuery({
    queryKey: ["turnaround-plans"],
    queryFn: getTurnaroundPlans,
    staleTime: 5 * 60 * 1000,
  });
};
