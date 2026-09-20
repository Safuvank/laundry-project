"use client";

import type { Notification } from "../types/notification.types";

import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onRead?: (notificationId: string) => void;
  emptyMessage?: string;
}

export default function NotificationList({
  notifications,
  onRead,
  emptyMessage = "You don't have any notifications.",
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <div className="mb-4 text-4xl">🔔</div>

        <h2 className="text-base font-semibold text-gray-800">
          No notifications
        </h2>

        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
