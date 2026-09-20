import { api } from "@/lib/api/axios";

import type {
  AdminOverviewReport,
  AdminOrderStatistics,
  AdminRevenueStatistics,
  AdminPaymentStatistics,
  AdminReportDateRange,
} from "../types/admin-report.types";

/*
 * --------------------------------------------------------------------------
 * Overview
 * --------------------------------------------------------------------------
 */

export const getAdminOverviewReport =
  async (): Promise<AdminOverviewReport> => {
    const response = await api.get(
      "/admin/reports/overview",
    );

    return response.data.data;
  };

/*
 * --------------------------------------------------------------------------
 * Order Statistics
 * --------------------------------------------------------------------------
 */

export const getAdminOrderStatistics =
  async (): Promise<AdminOrderStatistics> => {
    const response = await api.get(
      "/admin/reports/orders",
    );

    return response.data.data;
  };

/*
 * --------------------------------------------------------------------------
 * Revenue Statistics
 * --------------------------------------------------------------------------
 */

export const getAdminRevenueStatistics = async (
  params?: AdminReportDateRange,
): Promise<AdminRevenueStatistics> => {
  const response = await api.get(
    "/admin/reports/revenue",
    {
      params,
    },
  );

  return response.data.data;
};

/*
 * --------------------------------------------------------------------------
 * Payment Statistics
 * --------------------------------------------------------------------------
 */

export const getAdminPaymentStatistics = async (
  params?: AdminReportDateRange,
): Promise<AdminPaymentStatistics> => {
  const response = await api.get(
    "/admin/reports/payments",
    {
      params,
    },
  );

  return response.data.data;
};
