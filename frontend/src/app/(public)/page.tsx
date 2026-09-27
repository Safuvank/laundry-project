import Hero from "@/features/public/components/Hero";
import ServiceSection from "@/features/public/components/ServiceSection";
import HowItWorks from "@/features/public/components/HowItWorks";
import WhyWoosh from "@/features/public/components/WhyWoosh";
import CTASection from "@/features/public/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSection />
      <HowItWorks />
      <WhyWoosh />
      <CTASection />
    </>
  );
}
