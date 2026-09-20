import type { Order } from "@/features/orders/types/order.types";
import { OrderStatus } from "@/lib/constants/order-status";

interface DashboardStatsProps {
  orders: Order[];
}

export default function DashboardStats({ orders }: DashboardStatsProps) {
  const activeOrders = orders.filter(
    (order) =>
      order.isActive &&
      order.status !== OrderStatus.COMPLETED &&
      order.status !== OrderStatus.CANCELLED,
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED,
  ).length;

  const pendingApproval = orders.filter(
    (order) => order.status === OrderStatus.CUSTOMER_APPROVAL_PENDING,
  ).length;

  const totalOrders = orders.length;

  const stats = [
    {
      title: "Active Orders",
      value: activeOrders,
      description: "Currently in progress",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      description: "Successfully delivered",
    },
    {
      title: "Pending Approval",
      value: pendingApproval,
      description: "Requires your approval",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: "All your orders",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl bg-white p-6 ring-1 ring-gray-200 "
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            {stat.value}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}