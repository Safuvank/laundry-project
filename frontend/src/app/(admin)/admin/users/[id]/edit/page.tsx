import AdminEditUserContainer from "@/features/admin/components/users/AdminEditUserContainer";

interface AdminEditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditUserPage({
  params,
}: AdminEditUserPageProps) {
  const { id } = await params;

  return <AdminEditUserContainer userId={id} />;
}
