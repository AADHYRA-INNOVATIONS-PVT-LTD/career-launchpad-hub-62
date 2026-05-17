import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrainingDomains from "@/components/home/TrainingDomains";
import CourseCards from "@/components/home/CourseCards";
import PlacementSection from "@/components/home/PlacementSection";
import SuccessStorySection from "@/components/home/SuccessStorySection";
import CertificateShowcase from "@/components/home/CertificateShowcase";
import CollegeTPOSection from "@/components/home/CollegeTPOSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrainingDomains />
        <CourseCards />
        <SuccessStorySection />
        <PlacementSection />
        <CertificateShowcase />
        <CollegeTPOSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
