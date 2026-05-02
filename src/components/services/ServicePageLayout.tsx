import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, ArrowRight, Play, Sparkles, LucideIcon,
  Search, Lightbulb, Code2, Rocket, ShieldCheck, TrendingUp,
  Users, Award, Headphones, Clock,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServicePageLayoutProps {
  badge: string;
  title: string;
  tagline: string;
  description: string;
  heroGradient: string;
  videoPosterAnimation: ReactNode;
  features: ServiceFeature[];
  offerings: string[];
  industries?: string[];
}

const ServicePageLayout = ({
  badge,
  title,
  tagline,
  description,
  heroGradient,
  videoPosterAnimation,
  features,
  offerings,
  industries,
}: ServicePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <AnimatedBackground />
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{badge}</Badge>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
                <p className="text-lg text-primary font-medium mb-3">{tagline}</p>
                <p className="text-muted-foreground mb-8">{description}</p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button size="lg" className="gap-2">
                      Get a Quote <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Sparkles className="h-4 w-4" /> Start a Project
                    </Button>
                  </Link>
                </div>
                {/* Trust strip */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <div className="text-2xl font-bold text-foreground">500+</div>
                    <div className="text-xs text-muted-foreground">Projects shipped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-xs text-muted-foreground">Client retention</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">24/7</div>
                    <div className="text-xs text-muted-foreground">Support SLA</div>
                  </div>
                </div>
              </div>

              {/* Animated explainer "video" — pure CSS motion graphic */}
              <div className={`relative aspect-video rounded-3xl overflow-hidden shadow-card-hover bg-gradient-to-br ${heroGradient}`}>
                <div className="absolute inset-0 grid-pattern opacity-30" />
                {videoPosterAnimation}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                    <Play className="h-10 w-10 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium">{badge} — Explainer</p>
                  <p className="text-xs opacity-80">AI-generated motion preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why us — rsoftai style trust block */}
        <section className="py-12 border-y bg-muted/20">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, title: "Industry Expertise", desc: "10+ years building enterprise-grade solutions" },
                { icon: ShieldCheck, title: "Secure by Design", desc: "ISO-aligned, audited, SOC-ready architecture" },
                { icon: TrendingUp, title: "Proven ROI", desc: "Measurable business outcomes, not vanity metrics" },
                { icon: Headphones, title: "Always-on Support", desc: "Dedicated success manager + 24/7 helpdesk" },
              ].map((w) => {
                const Icon = w.icon;
                return (
                  <div key={w.title} className="flex gap-3 items-start">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{w.title}</h4>
                      <p className="text-xs text-muted-foreground">{w.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">What we deliver</h2>
              <p className="text-muted-foreground">Production-grade solutions, end-to-end</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-card border rounded-xl p-6 hover:shadow-card-hover transition">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process — 4 steps */}
        <section className="py-16 bg-gradient-to-br from-background to-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Our Process</Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">How we deliver excellence</h2>
              <p className="text-muted-foreground">A transparent, milestone-driven engagement model</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { icon: Search, step: "01", title: "Discover", desc: "Workshops, requirement mapping, success KPIs" },
                { icon: Lightbulb, step: "02", title: "Design", desc: "Architecture, UX flows, prototypes & approval" },
                { icon: Code2, step: "03", title: "Build", desc: "Agile sprints, weekly demos, full transparency" },
                { icon: Rocket, step: "04", title: "Launch & Grow", desc: "Deploy, monitor, optimize, scale on demand" },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.step} className="relative bg-card border rounded-2xl p-6 hover:shadow-card-hover transition group">
                    <div className="absolute -top-3 -right-3 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white font-heading font-bold flex items-center justify-center shadow-lg">
                      {p.step}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Service offerings</h2>
                <p className="text-muted-foreground mb-6">
                  Pick a single solution or a full package — we customize to your business goals.
                </p>
                <ul className="space-y-3">
                  {offerings.map((o) => (
                    <li key={o} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {industries && (
                <div className="bg-card border rounded-2xl p-8">
                  <h3 className="font-heading text-xl font-bold mb-4">Industries we serve</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((i) => (
                      <Badge key={i} variant="outline" className="py-1.5 px-3">
                        {i}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> <span className="text-sm text-foreground">200+ clients</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> <span className="text-sm text-foreground">2-4 wk delivery</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="bg-card border rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl text-primary/30 font-heading mb-2">"</div>
                <p className="text-lg md:text-xl text-foreground font-medium mb-6 leading-relaxed">
                  AADHYRA delivered our {badge.toLowerCase()} platform in 6 weeks — beating our internal estimate by 3 months.
                  Their team operates like an extension of ours: senior engineers, daily updates, and zero surprises.
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold">
                    PR
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Priya Ramesh</div>
                    <div className="text-sm text-muted-foreground">CTO, Enterprise Client</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">FAQ</Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Frequently asked questions</h2>
              <p className="text-muted-foreground">Everything you need to know before getting started</p>
            </div>
            <Accordion type="single" collapsible className="bg-card border rounded-2xl px-6">
              {[
                { q: `How long does a typical ${badge} project take?`, a: "Most engagements run 4–12 weeks depending on scope. We share a fixed roadmap with weekly milestones after the discovery call." },
                { q: "Do you sign NDAs and IP-protection agreements?", a: "Yes. All client data, source code, and IP belong fully to you. We sign mutual NDAs before any technical discussion." },
                { q: "What is your pricing model?", a: "We offer fixed-price (best for defined scope), monthly retainer (best for ongoing work), and hourly (best for support). All quotes are GST-compliant." },
                { q: "Do you provide post-launch support?", a: "Every project includes 60 days of free bug-fix support. Extended SLA-backed support plans start at ₹15,000/month." },
                { q: "Which technologies do you specialise in?", a: "Modern web (React, Next.js, Node), mobile (React Native, Flutter), AI/ML (Python, LangChain, OpenAI/Gemini), Cloud (AWS, GCP, Azure), and our R Product Suite." },
              ].map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-10 text-center text-primary-foreground">
              <h2 className="font-heading text-3xl font-bold mb-3">Ready to build with us?</h2>
              <p className="opacity-90 mb-6">Talk to our team and get a tailored proposal within 24 hours.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/contact">
                  <Button size="lg" variant="accent" className="gap-2">
                    Contact Sales <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10">
                    <Sparkles className="h-4 w-4" /> Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePageLayout;
