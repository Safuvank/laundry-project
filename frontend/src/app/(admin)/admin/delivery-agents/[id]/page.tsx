import AdminDeliveryAgentDetailsContainer from "@/features/admin/components/delivery-agents/AdminDeliveryAgentDetailsContainer";

interface AdminDeliveryAgentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminDeliveryAgentDetailsPage({
  params,
}: AdminDeliveryAgentDetailsPageProps) {
  const { id } = await params;

  return (
    <AdminDeliveryAgentDetailsContainer
      deliveryAgentId={id}
    />
  );
}