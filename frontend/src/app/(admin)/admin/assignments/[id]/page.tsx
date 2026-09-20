import AdminAssignmentDetailsContainer from "@/features/admin/components/assignments/AdminAssignmentDetailsContainer";

interface AdminAssignmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminAssignmentDetailsPage({
  params,
}: AdminAssignmentDetailsPageProps) {
  const { id } = await params;

  return (
    <AdminAssignmentDetailsContainer
      assignmentId={id}
    />
  );
}