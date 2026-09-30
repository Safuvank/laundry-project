"use client";

import { FormEvent, useState } from "react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = event.currentTarget;

    const formData = new FormData(form);

    const data: ContactFormData = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const scriptUrl =
        process.env.NEXT_PUBLIC_GOOGLE_CONTACT_FORM_URL;

      if (!scriptUrl) {
        throw new Error(
          "Contact form service is not configured.",
        );
      }

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      });

      setSuccessMessage(
        "Thank you! Your message has been sent successfully.",
      );

      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      setErrorMessage(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gray-50 p-8 ring-1 ring-inset ring-gray-200 sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
        Send us a message
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Fill out the form below and we'll be in touch shortly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First name
            </label>

            <div className="mt-2.5">
              <input
                type="text"
                name="firstName"
                id="first-name"
                autoComplete="given-name"
                required
                className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
                placeholder="John"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last name
            </label>

            <div className="mt-2.5">
              <input
                type="text"
                name="lastName"
                id="last-name"
                autoComplete="family-name"
                required
                className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>

          <div className="mt-2.5">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Subject
          </label>

          <div className="mt-2.5">
            <select
              id="subject"
              name="subject"
              required
              className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors bg-white"
            >
              <option value="General Inquiry">
                General Inquiry
              </option>

              <option value="Question about an Order">
                Question about an Order
              </option>

              <option value="Pricing & Services">
                Pricing & Services
              </option>

              <option value="Partnerships">
                Partnerships
              </option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Message
          </label>

          <div className="mt-2.5">
            <textarea
              name="message"
              id="message"
              rows={4}
              required
              className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
              placeholder="How can we help you?"
            />
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="block w-full rounded-lg bg-blue-600 px-8 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isSubmitting
              ? "Sending..."
              : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}