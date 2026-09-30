import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* LEFT SIDE: Form Section */}
      <div className="flex h-full w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm xl:max-w-md">

          {/* Logo */}
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tight text-gray-900">
              Woosh
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter your email and we'll send you a password reset link.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>

      {/* RIGHT SIDE: Full-size Local Laundry Image */}
      <div className="relative hidden h-full w-1/2 lg:block">
        <img
          src="/home/register.webp"
          alt="Woosh Laundry facility"
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  );
}