import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          {/* Changed FreshFold color to blue-600 */}
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            FreshFold
          </Link>

          <p className="mt-4 max-w-sm text-sm text-gray-600">
            Simple, reliable laundry service with convenient pickup and
            delivery.
          </p>
        </div>

        <div>
          {/* Changed Quick Links color to blue-600 */}
          <h3 className="font-semibold text-blue-600">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
            <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
            <Link href="/services" className="transition-colors hover:text-blue-600">Services</Link>
            <Link href="/about" className="transition-colors hover:text-blue-600">About</Link>
            <Link href="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
          </div>
        </div>

        <div>
          {/* Changed Services color to blue-600 */}
          <h3 className="font-semibold text-blue-600">Services</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
            <span>Wash & Fold</span>
            <span>Dry Cleaning</span>
            <span>Ironing</span>
            <span>Pickup & Delivery</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} FreshFold. All rights reserved.
        </div>
      </div>
    </footer>
  );
}