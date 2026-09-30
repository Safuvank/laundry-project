import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left side: Form */}
      <div className="flex h-full w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm xl:max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Log in to your Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Select method to log in:
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right side: Full-size Local Image */}
      <div className="relative hidden h-full w-1/2 lg:block">
        <img
          src="/home/register.webp"
          alt="Woosh Laundry"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
