"use client";

import { useRouter } from "next/navigation";

import type { Notification } from "../types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onRead?: (notificationId: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "ORDER_BOOKED":
      return "🧺";

    case "DELIVERY_ASSIGNED":
      return "🚚";

    case "ORDER_PICKED_UP":
      return "📦";

    case "PRICE_FINALIZED":
    case "CUSTOMER_APPROVAL_PENDING":
      return "💰";

    case "READY_FOR_DELIVERY":
      return "✅";

    default:
      return "🔔";
  }
};

const formatNotificationDate = (date: string) => {
  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  return notificationDate.toLocaleString();
};

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification._id);
    }

    if (notification.orderId) {
      router.push(`/orders/${notification.orderId}`);
    }
  };

  return (
    <article
      role={notification.orderId ? "button" : undefined}
      tabIndex={notification.orderId ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (
          notification.orderId &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          handleClick();
        }
      }}
      className={`border-b border-gray-200 p-4 transition ${
        notification.orderId ? "cursor-pointer hover:bg-gray-50" : ""
      } ${!notification.isRead ? "bg-blue-50/50" : "bg-white"}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-sm ${
                notification.isRead
                  ? "font-medium text-gray-800"
                  : "font-semibold text-gray-900"
              }`}
            >
              {notification.title}
            </h3>

            {!notification.isRead && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            )}
          </div>

          <p className="mt-1 text-sm leading-5 text-gray-600">
            {notification.message}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {formatNotificationDate(notification.createdAt)}
            </p>

            {notification.orderId && (
              <span className="text-xs font-medium text-blue-600">
                View order →
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
