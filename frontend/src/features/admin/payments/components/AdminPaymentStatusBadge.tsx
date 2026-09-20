interface AdminPaymentStatusBadgeProps {
  status: string;
}

export default function AdminPaymentStatusBadge({
  status,
}: AdminPaymentStatusBadgeProps) {
  const styles: Record<string, string> = {
    PENDING:
      "bg-amber-100 text-amber-800 border border-amber-300",
    PAID:
      "bg-emerald-100 text-emerald-800 border border-emerald-300",
    FAILED:
      "bg-red-100 text-red-800 border border-red-300",
    REFUNDED:
      "bg-violet-100 text-violet-800 border border-violet-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ??
        "bg-slate-100 text-slate-800 border border-slate-300"
      }`}
    >
      {status}
    </span>
  );
}
