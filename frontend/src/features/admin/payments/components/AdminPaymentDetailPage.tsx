"use client";

import Link from "next/link";

import { useAdminPayment } from "../hooks/useAdminPayment";
import AdminPaymentStatusBadge from "./AdminPaymentStatusBadge";

interface AdminPaymentDetailPageProps {
  paymentId: string;
}

export default function AdminPaymentDetailPage({
  paymentId,
}: AdminPaymentDetailPageProps) {
  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useAdminPayment(paymentId);

  if (isLoading) {
    return (
      <div className="bg-slate-50 p-6 text-slate-900">
        <p>Loading payment...</p>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="space-y-4 bg-slate-50 p-6 text-slate-900">
        <p className="text-red-700">
          {error instanceof Error ? error.message : "Payment not found."}
        </p>

        <Link href="/admin/payments" className="text-blue-700 underline">
          Back to payments
        </Link>
      </div>
    );
  }

  const customerName = payment.userId
    ? `${payment.userId.firstName} ${payment.userId.lastName}`
    : "Unknown user";

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Payment Details</h1>

          <p className="font-mono text-sm text-slate-600">{payment._id}</p>
        </div>

        <Link
          href="/admin/payments"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">
            Payment Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Amount</p>

              <p className="font-semibold text-slate-950">
                ₹{payment.amount.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Payment Method</p>

              <p className="text-slate-900">{payment.paymentMethod}</p>
            </div>

            <div>
              <p className="mb-1 text-sm text-slate-600">Status</p>

              <AdminPaymentStatusBadge status={payment.status} />
            </div>

            <div>
              <p className="text-sm text-slate-600">Created</p>

              <p className="text-slate-900">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">
            Customer
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Name</p>

              <p className="text-slate-900">{customerName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Email</p>

              <p className="text-slate-900">
                {payment.userId?.email ?? "No email"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Phone</p>

              <p className="text-slate-900">
                {payment.userId?.phoneNumber ?? "No phone"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Order</h2>

          {payment.orderId ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Order ID</p>

                <p className="font-mono text-sm text-slate-900">
                  {payment.orderId._id}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600">Order Status</p>

                <p className="text-slate-900">{payment.orderId.status}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600">Order Payment Status</p>

                <p className="font-medium text-slate-900">
                  {payment.orderId.paymentStatus}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-600">No order information available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
