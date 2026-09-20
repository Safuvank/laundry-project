"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logoutMutation = useLogout();

  // Role-based dashboard
  const getDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "ADMIN":
        return "/admin";

      case "DELIVERY_AGENT":
        return "/delivery";

      case "USER":
      default:
        return "/dashboard";
    }
  };

  const dashboardPath = getDashboardPath();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        setIsMobileMenuOpen(false);
        router.push("/");
      },
      onError: () => {
        clearAuth();
        setIsMobileMenuOpen(false);
        router.push("/");
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          FreshFold
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication & Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* User */}
              <span className="text-sm font-medium text-slate-700">
                Hi, {user.firstName}
              </span>

              {/* Role-based Dashboard */}
              <Link
                href={dashboardPath}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Dashboard
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationBell />}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>

            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2 sm:px-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4 py-4 sm:px-6">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 text-sm font-medium text-slate-500">
                  Signed in as{" "}
                  <span className="font-bold text-slate-900">
                    {user.firstName}
                  </span>
                </div>

                {/* Role-based Dashboard */}
                <Link
                  href={dashboardPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg bg-blue-50 px-4 py-3 text-center text-base font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-base font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-center text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
