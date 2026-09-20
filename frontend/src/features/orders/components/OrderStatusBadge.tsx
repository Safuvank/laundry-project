import type { OrderStatus } from "@/lib/constants/order-status";
import {
  formatOrderStatus,
  getOrderStatusClasses,
} from "../utils/order-status.utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function OrderStatusBadge({
  status,
  size = "sm",
}: OrderStatusBadgeProps) {
  const sizeClasses =
    size === "md" ? "px-3.5 py-1.5 text-sm" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full font-semibold tracking-wide ${sizeClasses} ${getOrderStatusClasses(
        status,
      )}`}
    >
      {formatOrderStatus(status)}
    </span>
  );
}
