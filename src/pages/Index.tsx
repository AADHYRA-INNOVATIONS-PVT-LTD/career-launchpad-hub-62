import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import VisitorPaths from "@/components/home/VisitorPaths";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import VisionSection from "@/components/home/VisionSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import InternshipHighlights from "@/components/home/InternshipHighlights";
import PlacementServicesSection from "@/components/home/PlacementServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SuccessStorySection from "@/components/home/SuccessStorySection";
import CertificateShowcase from "@/components/home/CertificateShowcase";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <VisitorPaths />
        <ServicesSection />
        <ProductsSection />
        <VisionSection />
        <WhyChooseSection />
        <InternshipHighlights />
        <PlacementServicesSection />
        <TestimonialsSection />
        <SuccessStorySection />
        <CertificateShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
