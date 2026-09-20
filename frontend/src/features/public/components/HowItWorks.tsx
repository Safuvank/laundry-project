import React from "react";

const steps = [
  {
    id: "01",
    name: "Schedule a Pickup",
    description: "Choose a convenient time and location through our website or mobile app.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "02",
    name: "We Collect",
    description: "Our friendly driver will arrive with custom laundry bags to safely collect your items.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    id: "03",
    name: "Expert Cleaning",
    description: "Your clothes are sorted, washed with eco-friendly detergents, and perfectly folded.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "04",
    name: "Fresh Delivery",
    description: "We deliver your clean, fresh clothes right back to your door within 24 hours.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 md:py-24 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Simple Process
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            How FreshFold Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We've streamlined the laundry process so you can get back to doing what you love. Fresh clothes are just a few taps away.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative flex flex-col rounded-2xl bg-white p-8 ring-1 ring-inset ring-gray-200"
              >
                {/* Step Number Background Watermark */}
                <span className="absolute right-6 top-6 select-none text-6xl font-bold text-gray-50">
                  {step.id}
                </span>

                {/* Icon Container */}
                <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="relative mb-3 text-lg font-semibold tracking-tight text-gray-900">
                  {step.name}
                </h3>
                <p className="relative text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
                
                {/* Decorative connecting line for desktop (hidden on last item and mobile) */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-14 -right-4 hidden w-8 border-t-2 border-dashed border-gray-200 lg:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}