"use client";

import { useAuthStore } from "@/stores/auth.store";

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-blue-600">
        Customer Dashboard
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Welcome back, {user?.firstName} 👋
      </h1>

      <p className="mt-2 max-w-2xl text-base text-gray-500">
        Keep track of your laundry orders, pickups, deliveries, and payments from one place.
      </p>
    </div>
  );
}