import AdminPaymentDetailPage from "@/features/admin/payments/components/AdminPaymentDetailPage";

interface AdminPaymentDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPaymentDetailRoute({
  params,
}: AdminPaymentDetailRouteProps) {
  const { id } = await params;

  return <AdminPaymentDetailPage paymentId={id} />;
}