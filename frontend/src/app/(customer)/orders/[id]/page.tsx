import OrderDetails from "@/features/orders/components/OrderDetails";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  return <OrderDetails orderId={id} />;
}