import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Auth Header */}
      {/* <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            FreshFold
          </Link>
        </div>
      </header> */}

      {/* Auth Content */}
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>

      {/* Auth Footer */}
      {/* <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FreshFold. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}