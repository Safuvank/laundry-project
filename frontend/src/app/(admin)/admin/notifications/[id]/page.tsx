import AdminNotificationDetailPage from "@/features/admin/notifications/components/AdminNotificationDetailPage";

interface NotificationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotificationDetailPage({
  params,
}: NotificationDetailPageProps) {
  const { id } = await params;

  return <AdminNotificationDetailPage notificationId={id} />;
}