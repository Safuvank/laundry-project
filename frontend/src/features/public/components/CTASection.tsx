import Link from "next/link";

export default function CTASection() {
  return (
   
          <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-2xl bg-blue-950 px-6 py-16 text-center sm:px-16 sm:py-20 lg:px-24">
                
                {/* Clean geometric background overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    
                <div className="relative z-10">
                  <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Ready to cross laundry off your to-do list?
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-blue-100/80">
                    Create an account in less than two minutes and schedule your first pickup today. Let us handle the dirt while you enjoy your day.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-950 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
                    >
                      Schedule a Pickup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
  );
}