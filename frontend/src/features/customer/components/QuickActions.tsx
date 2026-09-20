"use client";

import Link from "next/link";

const actions = [
  {
    title: "New Order",
    description: "Schedule a laundry pickup",
    href: "/orders/new",
  },
  {
    title: "My Orders",
    description: "View your laundry orders",
    href: "/orders",
  },
  {
    title: "Track Order",
    description: "Check your order status",
    href: "/orders",
  },
  {
    title: "Profile",
    description: "Manage your account",
    href: "/profile",
  },
];

const QuickActions = () => {
  return (
    <section>
      <div className="mb-4">
        <p className="text-sm font-semibold text-blue-600">Quick Actions</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
          What would you like to do?
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:ring-blue-500"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {action.description}
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
              Open &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;