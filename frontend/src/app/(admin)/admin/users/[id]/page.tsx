import UserDetails from "@/features/admin/components/users/UserDetails";

import AdminUserDetailsContainer from "@/features/admin/components/users/AdminUserDetailsContainer";

interface AdminUserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminUserDetailsPage({
  params,
}: AdminUserDetailsPageProps) {
  const { id } = await params;

  return (
    <AdminUserDetailsContainer userId={id} />
  );
}
