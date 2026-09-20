import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/layouts/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <AdminSidebar />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}