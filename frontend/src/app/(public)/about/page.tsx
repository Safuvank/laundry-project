import React from "react";
import Link from "next/link";

const stats = [
  { label: "Pounds of laundry washed", value: "500k+" },
  { label: "Happy customers", value: "10,000+" },
  { label: "Hours saved for our users", value: "2.5M" },
  { label: "Cities currently served", value: "12" },
];

const values = [
  {
    title: "Obsessive Quality",
    description: "We treat every garment as if it were our own. From rigorous pocket-checks to fabric-specific treatments, our standards are uncompromising.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "Eco-Conscious Care",
    description: "We use high-efficiency machines that save thousands of gallons of water, paired with biodegradable, hypoallergenic detergents that are tough on stains but gentle on the earth.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Radical Convenience",
    description: "Your time is your most valuable asset. We designed our app, scheduling, and delivery processes to be completely frictionless.",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Mission
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            We're on a mission to give you your <span className="text-blue-600">weekend back.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Laundry is a chore that never truly ends. We built FreshFold to change that. We combine expert garment care with seamless technology so you never have to think about laundry day again.
          </p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16 sm:py-24 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            
            {/* Visual/Image Side */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-inset ring-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-400">
                <svg className="mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" />
                </svg>
                <span className="text-sm font-medium">Team or Facility Image Here</span>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center lg:pt-8">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Born out of frustration. Built for perfection.
              </h2>
              <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-500">
                <p>
                  FreshFold started in 2018 when our founders realized they were spending an average of 4 hours every weekend sorting, washing, and folding. Local laundromats were inconvenient, and high-end dry cleaners were too expensive for everyday wear.
                </p>
                <p>
                  We knew there had to be a better way. We envisioned a service that married the precision of a high-end dry cleaner with the seamless digital experience of a modern app. 
                </p>
                <p>
                  Today, we operate our own state-of-the-art facilities, employing garment care experts rather than outsourcing to third parties. This allows us to control the quality of every single item that passes through our doors, ensuring your clothes return perfectly folded, smelling fresh, and ready to wear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-center md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-2">
                <dt className="text-sm font-medium leading-6 text-gray-400">{stat.label}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-24 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-500">
              The principles that guide everything from how we treat your clothes to how we treat our employees.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col rounded-2xl bg-gray-50 p-8 ring-1 ring-inset ring-gray-200">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-gray-900">{value.title}</h3>
                <p className="text-base leading-relaxed text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

    </main>
  );
}