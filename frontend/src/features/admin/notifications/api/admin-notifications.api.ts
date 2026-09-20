import { api } from "@/lib/api/axios";

import type {
  AdminNotificationListQuery,
  AdminNotificationsResponse,
  AdminNotificationResponse,
} from "../types/admin-notification.types";

/*
 * --------------------------------------------------------------------------
 * Admin Notifications
 * --------------------------------------------------------------------------
 */

/**
 * Get all notifications for admin
 *
 * Supports:
 * - Pagination
 * - Notification type filter
 * - Read/unread filter
 * - User filter
 * - Order filter
 */
export const getNotifications = async (
  params?: AdminNotificationListQuery,
): Promise<AdminNotificationsResponse> => {
  const response = await api.get<AdminNotificationsResponse>(
    "/admin/notifications",
    {
      params,
    },
  );

  return response.data;
};

/**
 * Get a single notification by ID
 */
export const getNotificationById = async (
  notificationId: string,
): Promise<AdminNotificationResponse> => {
  const response = await api.get<AdminNotificationResponse>(
    `/admin/notifications/${notificationId}`,
  );

  return response.data;
};