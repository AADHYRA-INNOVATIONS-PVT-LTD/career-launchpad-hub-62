import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Heart, Brain, ArrowRight, Users, Building2, Sparkles, CheckCircle2, Award, TrendingUp, Star, Target } from "lucide-react";

const products = [
  {
    title: "AADHYRA TALENT CONNECT",
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
    purpose: "Bridge the gap between skilled talent and top employers using AI-driven matching technology.",
    achievements: ["3,000+ candidates placed", "200+ active employers", "AI matching accuracy: 92%"],
    successStory: "Helped 500+ freshers land their first job within 30 days of registration.",
  },
  {
    title: "AADHYRA TECH PARTNER",
    tagline: "Freelancing Marketplace",
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
    purpose: "Empower freelancers to find quality projects and deliver world-class solutions with secure payments.",
    achievements: ["1,500+ projects completed", "₹2Cr+ in freelancer earnings", "4.8★ avg client rating"],
    successStory: "Our freelancers have built apps for 50+ startups across healthcare, fintech, and e-commerce.",
  },
  {
    title: "AADHYRA HEALTH CONNECT",
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
    purpose: "Make healthcare accessible and affordable through AI-powered telemedicine and home care services.",
    achievements: ["10,000+ patient consultations", "500+ verified doctors", "24/7 AI health support"],
    successStory: "Delivered home nursing services to 2,000+ patients across Bangalore and Hyderabad.",
  },
  {
    title: "AADHYRA LAB",
    tagline: "Prompt → Project Builder (like Lovable)",
    description:
      "Describe your idea — our AI generates the full project plan: features, pages, tech stack and data model.",
    icon: Brain,
    accent: "from-violet-500 to-purple-600",
    pageRoute: "/placement/ai-lab",
    logins: [{ label: "Open AADHYRA LAB", to: "/placement/ai-lab", icon: Sparkles }],
    bullets: ["AI Project Builder", "Resume Builder", "Mock Interview AI", "Career Path AI"],
    purpose: "Turn ideas into fully-planned projects using AI — from feature specs to tech stack to data models.",
    achievements: ["5,000+ projects generated", "AI-powered resume builder", "Mock interview simulations"],
    successStory: "Students who used AI Lab's mock interviews scored 40% higher in real interviews.",
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
                The Aadhyra <span className="text-gradient">Career Ecosystem</span>
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

                      {/* Purpose */}
                      {(p as any).purpose && (
                        <div className="bg-muted/30 rounded-lg p-3 mb-4 border">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Our Purpose</p>
                          <p className="text-sm text-muted-foreground">{(p as any).purpose}</p>
                        </div>
                      )}

                      {/* Achievements */}
                      {(p as any).achievements && (
                        <div className="mb-5">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Key Achievements</p>
                          <div className="space-y-1.5">
                            {(p as any).achievements.map((a: string) => (
                              <div key={a} className="flex items-center gap-2 text-sm text-foreground">
                                <Award className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                                <span>{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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

        {/* Success Stories */}
        <section className="py-12 lg:py-16 bg-card">
          <div className="container">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
                <Star className="h-3 w-3 mr-1" />
                Success Stories
              </Badge>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Impact Across Verticals</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title + "-story"} className="bg-muted/30 rounded-xl border p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.accent} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">{p.title.split(" ").slice(1).join(" ")}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{(p as any).successStory}</p>
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
