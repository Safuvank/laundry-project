import React from "react";
import Link from "next/link";

// Updated data using local image paths
const detailedServices = [
  {
    id: "wash-fold",
    title: "Wash & Fold",
    tagline: "Your everyday laundry, handled with care.",
    description: "Reclaim your weekend. We sort your lights and darks, wash them with premium hypoallergenic detergents, tumble dry on optimal settings, and meticulously fold everything so it's drawer-ready the moment we deliver it.",
    price: "$1.50 / lb",
    features: [
      "Color sorting included",
      "Custom temperature settings",
      "Socks paired & neatly folded",
      "Hypoallergenic options available"
    ],
    // Points to: public/images/wash-fold.jpg
    image: "/service/washandfold.webp",
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    tagline: "Professional care for your delicate and formal wear.",
    description: "For fabrics that need a gentler touch. Our eco-friendly dry cleaning process removes stubborn stains while protecting the integrity of your suits, dresses, and silk garments. Everything is returned perfectly pressed and hung.",
    price: "$6.00 / item (avg)",
    features: [
      "Eco-friendly solvents",
      "Stain pre-treatment",
      "Hand-pressed finish",
      "Premium contoured hangers"
    ],
    // Points to: public/images/dry-cleaning.jpg
    image: "/service/drycleaning.webp",
  },
  {
    id: "wash-ironing",
    title: "Wash & Ironing",
    tagline: "Freshly washed and perfectly pressed.",
    description: "The complete package for your everyday wardrobe. We carefully wash your garments using premium detergents, then professionally steam iron them to ensure a crisp, wrinkle-free finish. Delivered on hangers or neatly folded based on your preference.",
    price: "$3.50 / item",
    features: [
      "Gentle wash cycle",
      "Professional steam ironing",
      "Hanging or folded delivery",
      "Starch available on request"
    ],
    // Points to: public/images/wash-ironing.jpg
    image: "/service/washandiron.webp",
  },
  {
    id: "ironing-only",
    title: "Ironing Only",
    tagline: "Crisp, wrinkle-free finishing for your attire.",
    description: "Already washed your clothes but hate ironing? Let us handle the tedious part. We provide professional high-pressure steam ironing for shirts, trousers, and dresses, ensuring sharp creases and a flawless look for your busy work week.",
    price: "$2.50 / item",
    features: [
      "High-pressure steam pressing",
      "Collar and cuff detailing",
      "Delicate fabric protection",
      "Next-day turnaround available"
    ],
    // Points to: public/images/ironing-only.jpg
    image: "/service/ironing.webp",
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gray-50 pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-gray-200">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Offerings
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Tailored laundry solutions <br className="hidden md:block" />
            for your busy lifestyle.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Whether you need a quick wash for your gym gear or delicate care for your favorite suit, we have a specialized process to keep you looking your best.
          </p>
        </div>
      </section>

      {/* Detailed Services Section (Alternating Layout) */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-24">
            {detailedServices.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col items-center gap-12 lg:flex-row ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual/Image side */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-inset ring-gray-200 relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Subtle overlay to ensure the image doesn't wash out the borders */}
                    <div className="absolute inset-0 bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 rounded-2xl"></div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 lg:px-8">
                  <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-lg font-medium text-blue-600">
                    {service.tagline}
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-gray-500">
                    {service.description}
                  </p>
                  
                  <div className="mt-8 border-t border-gray-100 pt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-900">What's included</h4>
                    <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                          <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Starting at</span>
                      <span className="text-2xl font-semibold text-gray-900">{service.price}</span>
                    </div>
                    <Link
                      href="/orders/new"
                      className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      Book this service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple "How it Works" Banner */}
      <section className="bg-gray-900 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Seamless from start to finish.</h2>
            <p className="mt-4 text-lg text-gray-400">Our process is designed around your convenience.</p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Schedule", desc: "Choose a pickup time on our app or website that works for you." },
              { step: "02", title: "We Clean", desc: "Our professionals inspect, clean, and fold your items with expert care." },
              { step: "03", title: "We Deliver", desc: "Fresh clothes returned right to your doorstep within 24 hours." }
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to experience the FreshFold difference?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Join thousands of happy customers who have outsourced their laundry day for good. First-time customers get 20% off their first order.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}