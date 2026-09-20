"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAdminOverviewReport,
  getAdminOrderStatistics,
  getAdminRevenueStatistics,
  getAdminPaymentStatistics,
} from "../api/admin-reports.api";

import type {
  AdminReportDateRange,
} from "../types/admin-report.types";

/*
 * --------------------------------------------------------------------------
 * Overview
 * --------------------------------------------------------------------------
 */

export const useAdminOverviewReport = () => {
  return useQuery({
    queryKey: ["admin", "reports", "overview"],
    queryFn: getAdminOverviewReport,
  });
};

/*
 * --------------------------------------------------------------------------
 * Order Statistics
 * --------------------------------------------------------------------------
 */

export const useAdminOrderStatistics = () => {
  return useQuery({
    queryKey: ["admin", "reports", "orders"],
    queryFn: getAdminOrderStatistics,
  });
};

/*
 * --------------------------------------------------------------------------
 * Revenue Statistics
 * --------------------------------------------------------------------------
 */

export const useAdminRevenueStatistics = (
  params: AdminReportDateRange = {},
) => {
  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "revenue",
      params,
    ],
    queryFn: () =>
      getAdminRevenueStatistics(params),
  });
};

/*
 * --------------------------------------------------------------------------
 * Payment Statistics
 * --------------------------------------------------------------------------
 */

export const useAdminPaymentStatistics = (
  params: AdminReportDateRange = {},
) => {
  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "payments",
      params,
    ],
    queryFn: () =>
      getAdminPaymentStatistics(params),
  });
};
