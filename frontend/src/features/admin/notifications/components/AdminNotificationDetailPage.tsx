"use client";

import Link from "next/link";

import { useAdminNotification } from "../hooks/useAdminNotification";

const getNotificationTypeLabel = (type: string) => {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getNotificationTypeStyle = (type: string) => {
  switch (type) {
    case "ORDER_CREATED":
      return "bg-blue-100 text-blue-700";

    case "PICKUP_ASSIGNED":
    case "DELIVERY_ASSIGNED":
      return "bg-purple-100 text-purple-700";

    case "OUT_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-700";

    case "PICKED_UP":
    case "DELIVERED":
    case "ORDER_COMPLETED":
      return "bg-green-100 text-green-700";

    case "ORDER_CANCELLED":
    case "PRICE_REJECTED":
      return "bg-red-100 text-red-700";

    case "PRICE_FINALIZED":
    case "PRICE_APPROVED":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (date?: string | null) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString();
};

export default function AdminNotificationDetailPage({
  notificationId,
}: {
  notificationId: string;
}) {
  const { data, isLoading, isError, error, refetch } =
    useAdminNotification(notificationId);

  const notification = data?.data;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading notification...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Failed to load notification
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading the notification."}
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

            <Link
              href="/admin/notifications"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back to Notifications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            Notification not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The notification you are looking for does not exist.
          </p>

          <Link
            href="/admin/notifications"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Notifications
          </Link>
        </div>
      </div>
    );
  }

  const user = notification.userId;

  const order = notification.orderId;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Back to Notifications
          </Link>

          <h1 className="mt-3 text-2xl font-semibold text-gray-900">
            Notification Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View the complete notification information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${getNotificationTypeStyle(
              notification.type,
            )}`}
          >
            {getNotificationTypeLabel(notification.type)}
          </span>

          {notification.isRead ? (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
              Read
            </span>
          ) : (
            <span className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
              Unread
            </span>
          )}
        </div>
      </div>

      {/* Notification */}

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {notification.title}
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {notification.message}
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Notification ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-gray-800">
              {notification._id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Notification Type
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {getNotificationTypeLabel(notification.type)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-1 text-sm text-gray-800">
              {formatDate(notification.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Updated At
            </p>

            <p className="mt-1 text-sm text-gray-800">
              {formatDate(notification.updatedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Read At
            </p>

            <p className="mt-1 text-sm text-gray-800">
              {formatDate(notification.readAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {notification.isRead ? "Read" : "Unread"}
            </p>
          </div>
        </div>
      </section>

      {/* User */}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Recipient</h2>

          <p className="mt-1 text-sm text-gray-500">
            User associated with this notification.
          </p>
        </div>

        {user ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-gray-800">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {user.phoneNumber ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Role
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Account Status
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.accountStatus}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email Verification
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {user.isEmailVerified ? "Verified" : "Not verified"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              User information is no longer available.
            </p>
          </div>
        )}
      </section>

      {/* Order */}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Related Order</h2>

          <p className="mt-1 text-sm text-gray-500">
            Order associated with this notification.
          </p>
        </div>

        {order ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order Status
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {order.status}
              </p>
            </div>

            <div className="md:col-span-2">
              <Link
                href={`/admin/orders/${order._id}`}
                className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                View Order
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              No related order is available for this notification.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
