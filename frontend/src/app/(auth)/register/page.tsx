import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* LEFT SIDE: Full-size Local Image */}
      <div className="relative hidden h-full w-1/2 lg:block">
        <img
          src="/home/register.webp"
          alt="Woosh Laundry"
          className="h-full w-full object-cover"
        />
      </div>

      {/* RIGHT SIDE: Form Section */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-6 py-10 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm xl:max-w-md">

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join Woosh and manage your laundry easily.
            </p>
          </div>

          <RegisterForm />

        </div>
      </div>

    </div>
  );
}