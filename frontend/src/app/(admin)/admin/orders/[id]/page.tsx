import AdminOrderDetailsContainer from "@/features/admin/components/orders/AdminOrderDetailsContainer";

interface AdminOrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  return <AdminOrderDetailsContainer orderId={id} />;
}
