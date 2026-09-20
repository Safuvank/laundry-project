import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/admin-notifications.api";

import type { AdminNotificationListQuery } from "../types/admin-notification.types";

export const useAdminNotifications = (
  params?: AdminNotificationListQuery,
) => {
  return useQuery({
    queryKey: ["admin", "notifications", params],

    queryFn: () => getNotifications(params),

    placeholderData: (previousData) => previousData,
  });
};