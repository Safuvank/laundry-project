

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-20"
      >
        <source src="/hero/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Darker Overlay for High Contrast / Clarity */}
      <div className="absolute inset-0 bg-slate-950/70 -z-10" />

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:text-left grid items-center gap-12 md:grid-cols-2 lg:py-32 w-full">
        
        {/* Text Content */}
        <div className="z-10">
          <p className="mb-4 flex items-center justify-center md:justify-start text-sm font-bold uppercase tracking-widest text-blue-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            FreshFold Laundry
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Fresh clothes.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Zero hassle.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200 drop-shadow">
            Professional laundry care with convenient pickup and delivery,
            designed to make your everyday life easier. Get back to what matters most.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 bg-white/10 backdrop-blur-md px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Optional Right Column / Spacer */}
        <div className="hidden md:block">
          {/* Leave empty to let the background video shine through */}
        </div>

      </div>
    </section>
  );
}

