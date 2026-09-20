import { Suspense } from "react";
import VerifyEmail from "@/features/auth/components/VerifyEmail";

// A sleek fallback UI to show while the Suspense boundary resolves
function VerifyEmailFallback() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white px-8 py-10 text-center shadow-xl shadow-slate-200/50 sm:px-10">
      <div className="flex flex-col items-center animate-pulse">
        <div className="mb-6 h-20 w-20 rounded-full bg-slate-100"></div>
        <div className="mb-4 h-6 w-48 rounded bg-slate-200"></div>
        <div className="h-4 w-full rounded bg-slate-100"></div>
        <div className="mt-2 h-4 w-3/4 rounded bg-slate-100"></div>
      </div>
    </div>
  );
}

// Next.js App Router Page
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 
        The Suspense boundary is required in Next.js when using useSearchParams() 
        in a client component to prevent build-time de-optimization. 
      */}
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
