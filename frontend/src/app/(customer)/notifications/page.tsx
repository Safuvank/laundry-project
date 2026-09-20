"use client";

import NotificationList from "@/features/notifications/components/NotificationList";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useMarkNotificationAsRead } from "@/features/notifications/hooks/useMarkNotificationAsRead";
import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/useMarkAllNotificationsAsRead";

export default function NotificationsPage() {
  const { data, isLoading, isError } = useNotifications();

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.data ?? [];

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const totalCount = notifications.length;

  const handleRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    markAllAsRead.mutate();
  };

  /*
   * Loading State
   */
  if (isLoading) {
    return (
      <main className="min-h-full bg-gray-50">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="mt-3 h-8 w-48 rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
          </div>

          {/* Summary Skeleton */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white" />
          </div>

          {/* List Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-1 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4 rounded-xl p-4"
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error State
   */
  if (isError) {
    return (
      <main className="min-h-full bg-gray-50">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-red-500"
                aria-hidden="true"
              >
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.52 20h14.96a2 2 0 0 0 1.73-3.14l-7.5-13a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-lg font-semibold text-gray-900">
              Unable to load notifications
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Something went wrong while loading your notifications.
              Please refresh the page and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page Header */}
        <header className="mb-8">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <span>Account</span>

            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1-.02-1.06L10.88 10 7.19 6.29a.75.75 0 1 1 1.08-1.04l4.2 4.25a.75.75 0 0 1 0 1.05l-4.2 4.25a.75.75 0 0 1-1.06-.03Z"
                clipRule="evenodd"
              />
            </svg>

            <span className="font-medium text-gray-700">
              Notifications
            </span>
          </div>

          {/* Title + Action */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Stay updated with your laundry orders, deliveries, and
                account activity.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={
                unreadCount === 0 || markAllAsRead.isPending
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 sm:w-auto"
            >
              {markAllAsRead.isPending ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-25"
                    />

                    <path
                      d="M21 12a9 9 0 0 1-9 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  Marking as read...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Mark all as read
                </>
              )}
            </button>
          </div>
        </header>

        {/* Notification Summary */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total notifications
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                  {totalCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-gray-700"
                  aria-hidden="true"
                >
                  <path
                    d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Unread */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Unread notifications
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                  {unreadCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                <span className="h-3 w-3 rounded-full bg-gray-900" />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section
          aria-labelledby="notification-list-title"
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h2
                id="notification-list-title"
                className="text-sm font-semibold text-gray-900"
              >
                Recent notifications
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Your latest FreshFold updates
              </p>
            </div>

            {totalCount > 0 && (
              <span className="text-xs font-medium text-gray-400">
                {totalCount} {totalCount === 1 ? "notification" : "notifications"}
              </span>
            )}
          </div>

          <div className="p-2 sm:p-3">
            <NotificationList
              notifications={notifications}
              onRead={handleRead}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
