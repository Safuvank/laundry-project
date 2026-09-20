import React from "react";

const features = [
  {
    id: 1,
    title: "Eco-Friendly Cleaning",
    description: "We use premium, biodegradable detergents that are tough on stains but gentle on your skin and the environment.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Meticulous Quality Control",
    description: "Every item is inspected before and after washing. Missing buttons? Loose threads? We catch them.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "100% Satisfaction Guarantee",
    description: "If you aren't completely thrilled with how your clothes look and smell, we will re-clean them for free. No questions asked.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
  },
];

export default function WhyFreshFold() {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Left Column: Visuals */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Main Image Placeholder */}
            <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-inset ring-gray-200">
              <div className="flex flex-col items-center text-gray-400">
                <svg className="mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Happy Customer Image</span>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-8 -left-8 hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-inset ring-gray-200 md:block lg:-left-12">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {/* Fake Avatar Circles */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 ring-1 ring-inset ring-gray-200/50"></div>
                  ))}
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-gray-900">5,000+</p>
                  <p className="text-sm font-medium text-gray-500">Happy Locals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              More than just a laundry service.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We know your clothes are an investment. That's why we treat every garment with the utmost care, utilizing modern technology and sustainable practices.
            </p>

            <div className="mt-12 space-y-8">
              {features.map((feature) => (
                <div key={feature.id} className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-inset ring-gray-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}