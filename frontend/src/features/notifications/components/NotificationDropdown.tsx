"use client";

import Link from "next/link";

import { useUnreadNotifications } from "../hooks/useUnreadNotifications";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";

import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useUnreadNotifications();

  const markAsRead = useMarkNotificationAsRead();

  const notifications = data?.data ?? [];

  const handleRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Notifications
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Stay updated about your orders
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Refresh notifications"
            title="Refresh"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h5M20 20v-5h-5M5.05 9A7 7 0 0 1 17.95 6.05L20 9M19 15a7 7 0 0 1-12.95 2.95L4 15"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-100 overflow-y-auto">
        {isLoading && (
          <div className="px-4 py-10 text-center">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        )}

        {isError && (
          <div className="px-4 py-10 text-center">
            <div className="mb-2 text-2xl">⚠️</div>

            <p className="text-sm font-medium text-red-600">
              Failed to load notifications.
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="px-4 py-10 text-center">
            <div className="mb-3 text-3xl">✓</div>

            <p className="text-sm font-semibold text-slate-700">
              You're all caught up!
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You have no unread notifications.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          notifications.length > 0 &&
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={handleRead}
            />
          ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-2">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
