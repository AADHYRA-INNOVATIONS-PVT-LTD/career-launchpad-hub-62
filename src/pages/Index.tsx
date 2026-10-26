import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import VisitorPaths from "@/components/home/VisitorPaths";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import VisionSection from "@/components/home/VisionSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import PopularCourses from "@/components/home/PopularCourses";
import CourseCards from "@/components/home/CourseCards";
import InternshipHighlights from "@/components/home/InternshipHighlights";
import PlacementServicesSection from "@/components/home/PlacementServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SuccessStorySection from "@/components/home/SuccessStorySection";
import LatestJobsSection from "@/components/home/LatestJobsSection";
import CertificateShowcase from "@/components/home/CertificateShowcase";
import CollegeTPOSection from "@/components/home/CollegeTPOSection";
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
        <PopularCourses />
        <CourseCards excludeIT className="pt-0" />
        <InternshipHighlights />
        <PlacementServicesSection />
        <TestimonialsSection />
        <SuccessStorySection />
        <LatestJobsSection />
        <CertificateShowcase />
        <CollegeTPOSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
