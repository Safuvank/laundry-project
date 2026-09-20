import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["DELIVERY_AGENT"]}>
      <Navbar />
      {children}
      <Footer />
    </ProtectedRoute>
  );
}
