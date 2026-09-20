import { useQuery } from "@tanstack/react-query";

import { getNotificationById } from "../api/admin-notifications.api";

export const useAdminNotification = (
  notificationId: string,
) => {
  return useQuery({
    queryKey: ["admin", "notifications", notificationId],

    queryFn: () => getNotificationById(notificationId),

    enabled: Boolean(notificationId),
  });
};