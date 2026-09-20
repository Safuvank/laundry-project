import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <Navbar />
      {children}
      <Footer />
    </ProtectedRoute>
  );
}
