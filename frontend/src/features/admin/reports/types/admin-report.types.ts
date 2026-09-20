import type { OrderStatus } from "@/lib/constants/order-status";

/*
 * --------------------------------------------------------------------------
 * Report Date Range
 * --------------------------------------------------------------------------
 */

export interface AdminReportDateRange {
  startDate?: string;
  endDate?: string;
}

/*
 * --------------------------------------------------------------------------
 * Overview Report
 * --------------------------------------------------------------------------
 */

export interface AdminOverviewReport {
  users: {
    total: number;
    active: number;
    suspended: number;
    blocked: number;
  };

  orders: {
    total: number;
    completed: number;
    cancelled: number;
    active: number;
  };

  revenue: {
    total: number;
    paid: number;
    pending: number;
    failed: number;
    refunded: number;
  };

  deliveryAgents: {
    total: number;
    active: number;
    available: number;
    busy: number;
  };
}

/*
 * --------------------------------------------------------------------------
 * Order Statistics
 * --------------------------------------------------------------------------
 */

export interface AdminOrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface AdminOrderStatistics {
  totalOrders: number;

  statusBreakdown: AdminOrderStatusCount[];

  completedOrders: number;

  cancelledOrders: number;

  activeOrders: number;
}

/*
 * --------------------------------------------------------------------------
 * Revenue Statistics
 * --------------------------------------------------------------------------
 */

export interface AdminRevenueData {
  date: string;
  revenue: number;
}

export interface AdminRevenueStatistics {
  totalRevenue: number;

  paidRevenue: number;

  refundedAmount: number;

  netRevenue: number;

  data: AdminRevenueData[];
}

/*
 * --------------------------------------------------------------------------
 * Payment Statistics
 * --------------------------------------------------------------------------
 */

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface AdminPaymentStatusCount {
  status: PaymentStatus;
  count: number;
  amount: number;
}

export interface AdminPaymentStatistics {
  totalPayments: number;

  totalAmount: number;

  statusBreakdown: AdminPaymentStatusCount[];
}
