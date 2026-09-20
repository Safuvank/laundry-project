import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-[100vh] w-full m-0 p-0 overflow-hidden bg-white">
      
      {/* LEFT SIDE: Form Section */}
      <div className="flex h-full w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm xl:max-w-md">
          
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              freshfold
            </span>
          </div>

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

      {/* RIGHT SIDE: Blue Graphic Area */}
      <div className="relative hidden h-full w-1/2 flex-col items-center justify-center bg-[#0d5eed] p-12 lg:flex">
        {/* Abstract floating graphic */}
        <div className="relative flex w-full max-w-md items-center justify-center">
          <div className="absolute h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
          
          <div className="relative z-10 w-full drop-shadow-2xl">
             <img
              src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3"
              alt="Dashboard visualization"
              className="h-[350px] w-full rounded-2xl border border-white/10 bg-white/10 object-cover shadow-2xl backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Bottom Text & Dots */}
        <div className="absolute bottom-16 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
            Connect with every application.
          </h2>
          <p className="mb-8 text-sm text-blue-100/80">
            Everything you need in an easily customizable dashboard.
          </p>
          
          <div className="flex justify-center gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            <div className="h-1.5 w-1.5 cursor-pointer rounded-full bg-white/30 transition-colors hover:bg-white/50"></div>
            <div className="h-1.5 w-1.5 cursor-pointer rounded-full bg-white/30 transition-colors hover:bg-white/50"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
}