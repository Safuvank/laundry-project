/*
 * --------------------------------------------------------------------------
 * Admin Notification Types
 * --------------------------------------------------------------------------
 */

export const ADMIN_NOTIFICATION_TYPES = [
  "ORDER_CREATED",
  "PICKUP_ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "RECEIVED_AT_FACILITY",
  "INSPECTION_STARTED",
  "PRICE_FINALIZED",
  "CUSTOMER_APPROVAL_REQUIRED",
  "PRICE_APPROVED",
  "PRICE_REJECTED",
  "PROCESSING_STARTED",
  "QUALITY_CHECK_STARTED",
  "READY_FOR_DELIVERY",
  "DELIVERY_ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "ORDER_COMPLETED",
  "ORDER_CANCELLED",
] as const;

export type AdminNotificationType = (typeof ADMIN_NOTIFICATION_TYPES)[number];

/*
 * --------------------------------------------------------------------------
 * Notification User
 * --------------------------------------------------------------------------
 */

export interface AdminNotificationUser {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber?: string | null;

  role: "USER" | "DELIVERY_AGENT" | "ADMIN";

  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";

  isEmailVerified: boolean;
}

/*
 * --------------------------------------------------------------------------
 * Notification Order
 * --------------------------------------------------------------------------
 */

export interface AdminNotificationOrder {
  _id: string;

  status: string;
}

/*
 * --------------------------------------------------------------------------
 * Notification
 * --------------------------------------------------------------------------
 */

export interface AdminNotification {
  _id: string;

  userId: AdminNotificationUser | null;

  type: AdminNotificationType;

  title: string;

  message: string;

  orderId?: AdminNotificationOrder | null;

  isRead: boolean;

  readAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

/*
 * --------------------------------------------------------------------------
 * Notification List Query
 * --------------------------------------------------------------------------
 */

export interface AdminNotificationListQuery {
  page?: number;

  limit?: number;

  type?: AdminNotificationType;

  isRead?: boolean;

  userId?: string;

  orderId?: string;
}

/*
 * --------------------------------------------------------------------------
 * Pagination
 * --------------------------------------------------------------------------
 */

export interface AdminNotificationPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

/*
 * --------------------------------------------------------------------------
 * API Responses
 * --------------------------------------------------------------------------
 */

export interface AdminNotificationsResponse {
  success: boolean;

  message: string;

  data: {
    notifications: AdminNotification[];

    pagination: AdminNotificationPagination;
  };
}

export interface AdminNotificationResponse {
  success: boolean;

  message: string;

  data: AdminNotification;
}
