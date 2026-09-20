import Hero from "@/features/public/components/Hero";
import ServiceSection from "@/features/public/components/ServiceSection";
import HowItWorks from "@/features/public/components/HowItWorks";
import WhyFreshFold from "@/features/public/components/WhyFreshFold";
import CTASection from "@/features/public/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSection />
      <HowItWorks />
      <WhyFreshFold />
      <CTASection />
    </>
  );
}
