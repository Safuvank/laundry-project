import React from "react";
import Link from "next/link";
import ContactForm from "@/features/public/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Page Header */}
      <section className="bg-gray-50 pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Get in Touch
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            We'd love to hear from you.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Have a question about our services, pricing, or a recent order? Send us a message and our support team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-24 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2">
            
            {/* Left Column: Contact Form */}
            <ContactForm />

            {/* Right Column: Contact Information */}
            <div className="flex flex-col justify-center gap-10 lg:pl-8">
              
              {/* Email Card */}
              <div className="flex gap-x-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Email Support</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Prefer to email? Send us a message and we'll respond within 24 hours.
                  </p>
                  <p className="mt-4">
                    <a href="mailto:support@Woosh.com" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                      support@woosh.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex gap-x-6 border-t border-gray-100 pt-10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Call Us</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Need immediate assistance with an active order? Give us a call during operating hours.
                  </p>
                  <p className="mt-4">
                    <a href="tel:+18005550199" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                      +91 99611 09630
                    </a>
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex gap-x-6 border-t border-gray-100 pt-10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Headquarters</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Our main processing facility and corporate office.
                  </p>
                  <address className="mt-4 not-italic text-sm font-medium text-gray-900">
                    Model Colony, Yeshwandapur <br />
                    Banglore<br />
                    Karnataka, 560022
                  </address>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex gap-x-6 border-t border-gray-100 pt-10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-gray-200">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Operating Hours</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Our customer support team is available during the following hours:
                  </p>
                  <div className="mt-4 flex flex-col gap-1 text-sm font-medium text-gray-900">
                    <div className="flex justify-between w-48">
                      <span className="text-gray-500">Mon - Sun:</span> 8:00 AM - 8:00 PM
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}