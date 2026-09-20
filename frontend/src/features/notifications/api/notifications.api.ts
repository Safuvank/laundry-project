import { api } from "@/lib/api/axios";

import type {
  NotificationResponse,
  NotificationsResponse,
  UnreadCountResponse,
  NotificationActionResponse,
} from "../types/notification.types";

/**
 * Get all notifications for the logged-in user.
 */
export const getNotifications = async (): Promise<NotificationsResponse> => {
  const response = await api.get<NotificationsResponse>("/notifications");

  return response.data;
};

/**
 * Get unread notifications.
 */
export const getUnreadNotifications =
  async (): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>(
      "/notifications/unread",
    );

    return response.data;
  };

/**
 * Get unread notification count.
 */
export const getUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );

    return response.data;
  };

/**
 * Get notification by ID.
 */
export const getNotificationById = async (
  notificationId: string,
): Promise<NotificationResponse> => {
  const response = await api.get<NotificationResponse>(
    `/notifications/${notificationId}`,
  );

  return response.data;
};

/**
 * Mark one notification as read.
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<NotificationResponse> => {
  const response = await api.patch<NotificationResponse>(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsAsRead =
  async (): Promise<NotificationActionResponse> => {
    const response = await api.patch<NotificationActionResponse>(
      "/notifications/read-all",
    );

    return response.data;
  };

/**
 * Delete notification.
 */
export const deleteNotification = async (
  notificationId: string,
): Promise<NotificationActionResponse> => {
  const response = await api.delete<NotificationActionResponse>(
    `/notifications/${notificationId}`,
  );

  return response.data;
};
