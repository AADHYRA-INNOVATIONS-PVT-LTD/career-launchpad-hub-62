import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Stethoscope, Briefcase, Megaphone, PenTool, FileText, Users, Target, CheckCircle2, GraduationCap, Award, Video, Brain, Globe, Cpu, Heart, Code, Palette, Search } from "lucide-react";
import DemoVideoSection from "@/components/shared/DemoVideoSection";

import thumbTechPartner from "@/assets/demo-thumb-tech-partner.jpg";
import thumbHealthConnect from "@/assets/demo-thumb-health-connect.jpg";
import thumbAILab from "@/assets/demo-thumb-ai-lab.jpg";
import thumbHiring from "@/assets/demo-thumb-hiring-process.jpg";
import thumbCulture from "@/assets/demo-thumb-company-culture.jpg";
import thumbInternship from "@/assets/demo-thumb-internship.jpg";

const placementDemoVideos = [
  { title: "Shiksha Talent Connect Overview", description: "AI-powered recruitment platform connecting candidates with employers", duration: "4:30", category: "Talent Connect", thumbnail: thumbCulture, gradient: "bg-gradient-to-br from-blue-600 to-primary" },
  { title: "Shiksha Tech Partner Demo", description: "Freelancing marketplace for IT professionals and designers", duration: "5:00", category: "Tech Partner", thumbnail: thumbTechPartner, gradient: "bg-gradient-to-br from-emerald-500 to-teal-700" },
  { title: "Shiksha Health Connect", description: "Doctor and patient healthcare consultation platform", duration: "4:15", category: "Health Connect", thumbnail: thumbHealthConnect, gradient: "bg-gradient-to-br from-cyan-500 to-blue-700" },
  { title: "Shiksha AI Lab Features", description: "AI-powered project builder, resume maker, and career tools", duration: "5:30", category: "AI Lab", thumbnail: thumbAILab, gradient: "bg-gradient-to-br from-violet-500 to-purple-700" },
  { title: "Hiring Process Explained", description: "Step-by-step guide through MCQ, Technical, and AI HR rounds", duration: "4:00", category: "Placements", thumbnail: thumbHiring, gradient: "bg-gradient-to-br from-orange-500 to-red-600" },
  { title: "Success Stories", description: "How students got placed at top companies through Shiksha Nex", duration: "3:45", category: "Success Stories", thumbnail: thumbInternship, gradient: "bg-gradient-to-br from-pink-500 to-rose-700" },
];

const shikshaProducts = [
  {
    title: "Shiksha Talent Connect",
    emoji: "🔹",
    tagline: "AI-Powered Recruitment Platform",
    description: "Connecting trained professionals with top companies through AI-driven skill matching, smart job recommendations, and verified candidate profiles.",
    features: ["AI Skill Matching", "Smart Job Alerts", "Verified Profiles", "Interview Scheduling"],
    color: "tech",
    icon: Search,
  },
  {
    title: "Shiksha Tech Partner",
    emoji: "🔹",
    tagline: "Freelancing Marketplace",
    description: "A dedicated marketplace for IT professionals, designers, and marketers to find freelance projects, build portfolios, and earn while learning.",
    features: ["Project Bidding", "Secure Payments", "Portfolio Showcase", "Client Reviews"],
    color: "marketing",
    icon: Code,
  },
  {
    title: "Shiksha Health Connect",
    emoji: "🔹",
    tagline: "Doctor & Nurse Consultation",
    description: "Connecting healthcare professionals with hospitals, clinics, and home care services. Enabling telemedicine and on-site consultation opportunities.",
    features: ["Teleconsultation", "Hospital Placements", "Home Care Jobs", "Nurse Staffing"],
    color: "healthcare",
    icon: Heart,
  },
  {
    title: "Shiksha AI Lab",
    emoji: "🔹",
    tagline: "AI Tools / Builder Platform",
    description: "An innovation hub providing AI-powered tools for resume building, interview preparation, code generation, and career planning — all in one place.",
    features: ["AI Resume Builder", "Mock Interview AI", "Code Playground", "Career Path AI"],
    color: "design",
    icon: Brain,
  },
];

const candidateServices = [
  { icon: FileText, title: "Resume Building", description: "AI-powered professional resume crafted by HR experts" },
  { icon: Palette, title: "Portfolio Support", description: "For designers & marketers with live project showcase" },
  { icon: Video, title: "Mock Interviews", description: "AI-based interview practice with instant feedback" },
  { icon: Target, title: "Job Referrals", description: "Direct referrals to 500+ partner companies" },
  { icon: GraduationCap, title: "Skill Matching", description: "Auto-match your profile with job requirements" },
  { icon: Award, title: "Certification", description: "Industry-recognized certificates boost your profile" },
];

const placementAreas = [
  { icon: Building2, title: "IT Companies", count: "200+", description: "Tech startups to MNCs" },
  { icon: Briefcase, title: "Corporate Offices", count: "150+", description: "HR & Operations roles" },
  { icon: Megaphone, title: "Marketing Agencies", count: "100+", description: "Digital marketing roles" },
  { icon: PenTool, title: "Design Studios", count: "75+", description: "Creative design positions" },
  { icon: Stethoscope, title: "Hospitals & Clinics", count: "50+", description: "Healthcare institutions" },
];

const PlacementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Placement Services & Shiksha Ecosystem
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                More than placements — a complete career ecosystem. From AI-powered recruitment to freelancing marketplace and healthcare connect.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">95%</div>
                  <div className="text-sm text-primary-foreground/70">Placement Rate</div>
                </div>
                <div className="w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">500+</div>
                  <div className="text-sm text-primary-foreground/70">Partner Companies</div>
                </div>
                <div className="w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold">5000+</div>
                  <div className="text-sm text-primary-foreground/70">Successful Placements</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shiksha Products Ecosystem */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Ecosystem</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
                Shiksha Products & Platforms
              </h2>
              <p className="text-muted-foreground">
                A suite of platforms designed to power every stage of your career journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {shikshaProducts.map((product) => {
                const Icon = product.icon;
                return (
                  <div key={product.title} className={`bg-card rounded-2xl border-2 border-${product.color}/20 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group`}>
                    <div className={`px-8 py-4 bg-${product.color}/10 border-b border-${product.color}/20`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-${product.color}/20 flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 text-${product.color}`} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-foreground">{product.emoji} {product.title}</h3>
                          <p className={`text-sm font-medium text-${product.color}`}>{product.tagline}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-muted-foreground mb-6">{product.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {product.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className={`h-4 w-4 text-${product.color} flex-shrink-0`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link to="/apply" className="inline-block mt-6">
                        <Button variant="outline" size="sm" className={`border-${product.color}/30 text-${product.color} hover:bg-${product.color}/10`}>
                          Learn More →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Placement Areas */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Where We Place Our Students
              </h2>
              <p className="text-muted-foreground">
                Our extensive network spans multiple industries and sectors.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {placementAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div key={area.title} className="bg-card rounded-xl border shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                    <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="font-heading text-2xl font-bold text-primary mb-1">{area.count}</div>
                    <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Candidates */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">For Candidates</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                  Complete Career Support
                </h2>
                <p className="text-muted-foreground mb-8">
                  From resume building to interview preparation, we provide end-to-end support to ensure your career success.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {candidateServices.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div key={service.title} className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Link to="/apply" className="inline-block mt-8">
                  <Button variant="hero" size="lg">Start Your Journey</Button>
                </Link>
              </div>
              
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Hiring Process</h3>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Select Department", desc: "Choose IT, HR, Marketing, Design, or Nursing" },
                    { step: "2", title: "Pay Evaluation Fee (₹499)", desc: "Unlock access to entrance tests" },
                    { step: "3", title: "MCQ Round", desc: "Domain-specific multiple choice questions" },
                    { step: "4", title: "Technical Round", desc: "Coding test (IT) or case study (Non-IT)" },
                    { step: "5", title: "AI-HR Interview", desc: "Video interview evaluated by AI" },
                    { step: "6", title: "Profile Creation", desc: "Auto-created candidate profile for hiring" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container">
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Partner With Us
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Looking for skilled IT professionals, HR specialists, marketers, designers, or nursing staff? Our trained candidates are ready to contribute from day one.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      Pre-screened, job-ready candidates
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      No placement fees for initial period
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-healthcare" />
                      Replacement guarantee
                    </li>
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <Link to="/contact">
                    <Button variant="hero" size="lg">Contact for Hiring</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlacementPage;
