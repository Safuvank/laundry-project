import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import WhatsAppButton from "@/features/public/components/WhatsAppButton";
interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
