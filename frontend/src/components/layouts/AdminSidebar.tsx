"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Truck,
  ClipboardList,
  CalendarClock,
  Tags,
  Bell,
  CreditCard,
  BarChart3,
} from "lucide-react";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Delivery Agents",
    href: "/admin/delivery-agents",
    icon: Truck,
  },
  {
    name: "Assignments",
    href: "/admin/assignments",
    icon: ClipboardList,
  },
  {
    name: "Pickup Slots",
    href: "/admin/pickup-slots",
    icon: CalendarClock,
  },
  {
    name: "Pricing",
    href: "/admin/pricing",
    icon: Tags,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      {/* Brand */}
      <div className="border-b border-slate-200 px-6 py-5">
        <Link
          href="/admin"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          FreshFold
        </Link>

        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {adminLinks.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.9}
                className={
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />

              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}