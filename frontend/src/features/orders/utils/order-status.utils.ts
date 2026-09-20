import { OrderStatus } from "@/lib/constants/order-status";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.BOOKED,
  OrderStatus.PICKUP_ASSIGNED,
  OrderStatus.OUT_FOR_PICKUP,
  OrderStatus.PICKED_UP,
  OrderStatus.RECEIVED_AT_FACILITY,
  OrderStatus.INSPECTION_IN_PROGRESS,
  OrderStatus.PRICE_FINALIZED,
  OrderStatus.CUSTOMER_APPROVAL_PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.QUALITY_CHECK,
  OrderStatus.READY_FOR_DELIVERY,
  OrderStatus.DELIVERY_ASSIGNED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];

/**
 * Convert an order status into a user-friendly label.
 *
 * Example:
 * CUSTOMER_APPROVAL_PENDING
 * → Customer Approval Pending
 */
export const formatOrderStatus = (status: OrderStatus): string => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/**
 * Return Tailwind classes for the order status badge.
 */
export const getOrderStatusClasses = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return "bg-emerald-50 text-emerald-700";

    case OrderStatus.CANCELLED:
      return "bg-red-50 text-red-700";

    case OrderStatus.ON_HOLD:
      return "bg-orange-50 text-orange-700";

    case OrderStatus.CUSTOMER_APPROVAL_PENDING:
      return "bg-amber-50 text-amber-700";

    case OrderStatus.OUT_FOR_PICKUP:
    case OrderStatus.OUT_FOR_DELIVERY:
      return "bg-indigo-50 text-indigo-700";

    case OrderStatus.PICKED_UP:
    case OrderStatus.DELIVERED:
      return "bg-violet-50 text-violet-700";

    case OrderStatus.RECEIVED_AT_FACILITY:
    case OrderStatus.INSPECTION_IN_PROGRESS:
    case OrderStatus.QUALITY_CHECK:
      return "bg-cyan-50 text-cyan-700";

    case OrderStatus.PROCESSING:
      return "bg-blue-50 text-blue-700";

    case OrderStatus.PRICE_FINALIZED:
      return "bg-orange-50 text-orange-700";

    case OrderStatus.PICKUP_ASSIGNED:
    case OrderStatus.DELIVERY_ASSIGNED:
      return "bg-slate-100 text-slate-700";

    case OrderStatus.READY_FOR_DELIVERY:
      return "bg-teal-50 text-teal-700";

    case OrderStatus.BOOKED:
    default:
      return "bg-blue-50 text-blue-700";
  }
};

/**
 * Get the index of a status in the normal customer order workflow.
 *
 * Example:
 * BOOKED → 0
 * PICKUP_ASSIGNED → 1
 * PICKED_UP → 3
 * CUSTOMER_APPROVAL_PENDING → 7
 * PROCESSING → 8
 * COMPLETED → 14
 *
 * Returns -1 when the status is not part of the normal workflow.
 */
export const getOrderStatusIndex = (status: OrderStatus): number => {
  return ORDER_STATUS_FLOW.indexOf(status);
};
