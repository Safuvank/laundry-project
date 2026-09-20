import React from "react";
import Link from "next/link";

const services = [
  {
    id: "wash-fold",
    title: "Wash & Fold",
    description: "Perfect for your everyday laundry. We wash, dry, and expertly fold your clothes so they are ready to go straight into your drawers.",
    price: "From $1.50 / lb",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    description: "Professional, eco-friendly care for your delicate fabrics and formal wear. Returned perfectly pressed and hung on premium hangers.",
    price: "From $6.00 / item",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "wash-ironing",
    title: "Wash & Ironing",
    description: "The complete package for your everyday wardrobe. Freshly washed with premium detergents and professionally steam pressed.",
    price: "From $3.50 / item",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: "ironing-only",
    title: "Ironing Only",
    description: "Already washed? Let us handle the tedious part. We provide professional high-pressure steam ironing for a crisp, flawless look.",
    price: "From $2.50 / item",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Services
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Expert care for every fabric.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              From your everyday gym clothes to your most delicate formal wear, 
              we have a specialized cleaning process designed to extend the life of your wardrobe.
            </p>
          </div>
          
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-lg bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100"
          >
            View Full Pricing
            <svg 
              className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex flex-col justify-between rounded-2xl bg-gray-50 p-8 ring-1 ring-inset ring-gray-200 sm:p-10"
            >
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  {service.icon}
                </div>
                
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-gray-900">
                  {service.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-500">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                <span className="text-sm font-semibold text-gray-900">
                  {service.price}
                </span>
                
                <Link 
                  href={`/services#${service.id}`}
                  className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-500"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}