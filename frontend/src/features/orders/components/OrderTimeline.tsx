"use client";

import type { OrderStatus } from "@/lib/constants/order-status";
import {
  ORDER_STATUS_FLOW,
  formatOrderStatus,
  getOrderStatusIndex,
} from "../utils/order-status.utils";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const STATUS_DESCRIPTIONS: Partial<Record<OrderStatus, string>> = {
  BOOKED: "Your order has been successfully placed.",

  PICKUP_ASSIGNED:
    "A delivery agent has been assigned to collect your laundry.",

  OUT_FOR_PICKUP: "Your delivery agent is on the way to collect your laundry.",

  PICKED_UP:
    "Your laundry has been picked up and is on its way to our facility.",

  RECEIVED_AT_FACILITY: "Your laundry has arrived at our facility.",

  INSPECTION_IN_PROGRESS: "Our team is inspecting your laundry items.",

  PRICE_FINALIZED:
    "The final price has been calculated based on the inspection.",

  CUSTOMER_APPROVAL_PENDING:
    "Please review and approve the final price to continue.",

  PROCESSING: "Your laundry is currently being processed.",

  QUALITY_CHECK: "Your laundry is going through our final quality check.",

  READY_FOR_DELIVERY: "Your clean laundry is ready for delivery.",

  DELIVERY_ASSIGNED:
    "A delivery agent has been assigned to deliver your order.",

  OUT_FOR_DELIVERY: "Your order is on the way to you.",

  DELIVERED: "Your laundry has been delivered successfully.",

  COMPLETED: "Your order has been completed successfully.",

  ON_HOLD: "Your order is currently on hold and requires further action.",

  CANCELLED: "This order has been cancelled and will not continue.",
};

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = getOrderStatusIndex(currentStatus);

  const isCancelled = currentStatus === "CANCELLED";
  const isOnHold = currentStatus === "ON_HOLD";
  const isCompleted = currentStatus === "COMPLETED";

  /*
   * --------------------------------------------------------------------------
   * CANCELLED
   * --------------------------------------------------------------------------
   */

  if (isCancelled) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-red-600">Order Timeline</p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Order Cancelled
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This order was cancelled and will not continue through the delivery
            workflow.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            ✕
          </div>

          <div>
            <p className="font-semibold text-red-700">Cancelled</p>

            <p className="mt-1 text-sm text-slate-500">
              This order is no longer active.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * ON HOLD
   * --------------------------------------------------------------------------
   */

  if (isOnHold) {
    return (
      <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-orange-600">Order Timeline</p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Order On Hold
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your order is currently on hold because the final price was
            rejected.
          </p>
        </div>

        <div className="mt-8">
          {ORDER_STATUS_FLOW.map((status, index) => {
            const completed = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div key={status} className="relative flex gap-4">
                {index < ORDER_STATUS_FLOW.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                      index < currentIndex ? "bg-blue-500" : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    completed
                      ? "border-blue-600 bg-blue-600 text-white"
                      : current
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {completed ? "✓" : current ? "!" : index + 1}
                </div>

                <div className="pb-8">
                  <p
                    className={`text-sm font-semibold ${
                      current
                        ? "text-orange-600"
                        : completed
                          ? "text-slate-900"
                          : "text-slate-400"
                    }`}
                  >
                    {formatOrderStatus(status)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {current
                      ? (STATUS_DESCRIPTIONS[status] ??
                        "Order is currently on hold.")
                      : completed
                        ? "Completed"
                        : "Upcoming"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-800">
            Action required
          </p>

          <p className="mt-1 text-sm text-orange-700">
            The final price was not approved. Please wait for further
            instructions from FreshFold.
          </p>
        </div>
      </section>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * NORMAL ORDER TIMELINE
   * --------------------------------------------------------------------------
   */

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-blue-600">Order Timeline</p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          {isCompleted ? "Order Completed" : "Order Progress"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {isCompleted
            ? "Your laundry order has been successfully completed."
            : "Follow your laundry order from pickup to completion."}
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-8">
        {ORDER_STATUS_FLOW.map((status, index) => {
          const completed = index < currentIndex;
          const current = index === currentIndex;
          const upcoming = index > currentIndex;

          const description =
            STATUS_DESCRIPTIONS[status] ?? "Order status updated.";

          /*
           * Once COMPLETED is reached, there should be no upcoming
           * business status after it.
           */
          const isFinalStatus = status === "COMPLETED" && current;

          return (
            <div key={status} className="relative flex gap-4">
              {/* Connecting line */}
              {index < ORDER_STATUS_FLOW.length - 1 && (
                <div
                  className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                    index < currentIndex ? "bg-blue-500" : "bg-slate-200"
                  }`}
                />
              )}

              {/* Status circle */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  completed
                    ? "border-blue-600 bg-blue-600 text-white"
                    : current
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {completed || current ? "✓" : index + 1}
              </div>

              {/* Status content */}
              <div
                className={`pb-8 ${
                  upcoming ? "text-slate-400" : "text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      current
                        ? "text-blue-600"
                        : completed
                          ? "text-slate-900"
                          : "text-slate-400"
                    }`}
                  >
                    {formatOrderStatus(status)}
                  </p>

                  {current && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                      Current
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 text-xs ${
                    current
                      ? "text-blue-600"
                      : completed
                        ? "text-slate-500"
                        : "text-slate-400"
                  }`}
                >
                  {current ? description : completed ? "Completed" : "Upcoming"}
                </p>

                {/* Final completion message */}
                {isFinalStatus && (
                  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-700">
                      ✓ Your laundry order is complete.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
