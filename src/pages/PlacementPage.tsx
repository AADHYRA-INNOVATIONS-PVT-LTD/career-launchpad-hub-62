import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Heart, Brain, ArrowRight, Users, Building2, Sparkles, CheckCircle2 } from "lucide-react";

const products = [
  {
    title: "Shiksha Talent Connect",
    tagline: "AI-Powered Recruitment — like Apna",
    description:
      "Smart job matching, verified candidate profiles, and direct in-app chat between candidates and employers.",
    icon: Search,
    accent: "from-blue-500 to-primary",
    pageRoute: "/placement/talent-connect",
    logins: [
      { label: "Candidate Login", to: "/auth", icon: Users },
      { label: "Employer Login", to: "/employer/auth", icon: Building2 },
    ],
    bullets: ["AI Skill Matching", "Verified Profiles", "Smart Job Alerts", "In-App Messaging"],
  },
  {
    title: "Shiksha Tech Partner",
    tagline: "Freelancing Marketplace — like Upwork",
    description:
      "Find freelance projects, build your portfolio, win bids, and get paid securely through escrow.",
    icon: Code,
    accent: "from-emerald-500 to-teal-600",
    pageRoute: "/placement/tech-partner",
    logins: [
      { label: "Freelancer Login", to: "/auth", icon: Users },
      { label: "Project Owner Login", to: "/employer/auth", icon: Building2 },
    ],
    bullets: ["Project Bidding", "Escrow Payments", "Portfolio Showcase", "Client Reviews"],
  },
  {
    title: "Shiksha Health Connect",
    tagline: "AI Healthcare & Telemedicine",
    description:
      "AI symptom checker, online doctor consultations, lab bookings, pharmacy, and home nursing services.",
    icon: Heart,
    accent: "from-cyan-500 to-blue-600",
    pageRoute: "/placement/health-connect",
    logins: [
      { label: "Patient Login", to: "/auth", icon: Users },
      { label: "Doctor / Nurse Login", to: "/employer/auth", icon: Building2 },
    ],
    bullets: ["AI Symptom Checker", "Online Consultations", "Lab + Pharmacy", "Home Nursing"],
  },
  {
    title: "Shiksha AI Lab",
    tagline: "Prompt → Project Builder (like Lovable)",
    description:
      "Describe your idea — our AI generates the full project plan: features, pages, tech stack and data model.",
    icon: Brain,
    accent: "from-violet-500 to-purple-600",
    pageRoute: "/placement/ai-lab",
    logins: [{ label: "Open AI Lab", to: "/placement/ai-lab", icon: Sparkles }],
    bullets: ["AI Project Builder", "Resume Builder", "Mock Interview AI", "Career Path AI"],
  },
];

const PlacementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero with animated background */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <AnimatedBackground />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">One Unified Platform</Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                The Shiksha <span className="text-gradient">Career Ecosystem</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Four powerful platforms — recruitment, freelancing, healthcare and AI tools — designed to power every
                stage of your career journey.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {products.map((p) => (
                  <a key={p.title} href={`#${p.title.split(" ").join("-").toLowerCase()}`}>
                    <Badge variant="outline" className="text-sm py-2 px-4 hover:bg-primary/10 cursor-pointer">
                      {p.title}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    id={p.title.split(" ").join("-").toLowerCase()}
                    className="group relative bg-card rounded-3xl border shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden"
                  >
                    <div className={`h-32 bg-gradient-to-br ${p.accent} relative overflow-hidden`}>
                      <div className="absolute inset-0 grid-pattern opacity-30" />
                      <div className="absolute -bottom-8 left-8 h-20 w-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-lg">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <div className="p-8 pt-12">
                      <h3 className="font-heading text-2xl font-bold text-foreground">{p.title}</h3>
                      <p className="text-sm font-medium text-primary mb-3">{p.tagline}</p>
                      <p className="text-muted-foreground mb-5">{p.description}</p>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {p.bullets.map((b) => (
                          <div key={b} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={p.pageRoute}>
                          <Button variant="outline" className="gap-2">
                            Learn More <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        {p.logins.map((l) => {
                          const LIcon = l.icon;
                          return (
                            <Link key={l.label} to={l.to}>
                              <Button className="gap-2">
                                <LIcon className="h-4 w-4" /> {l.label}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="py-12 bg-muted/30 border-y">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { v: "5,000+", l: "Placements" },
                { v: "500+", l: "Partner Companies" },
                { v: "₹8 LPA", l: "Avg Salary" },
                { v: "95%", l: "Placement Rate" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-heading text-3xl font-bold text-primary">{s.v}</div>
                  <div className="text-sm text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlacementPage;
