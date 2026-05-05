import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Brain, Cloud, BarChart3, Shield, Globe, Users, Sparkles,
  CheckCircle2, Search, Lightbulb, Code2, Rocket, Award, ShieldCheck,
  TrendingUp, Headphones, Star, Zap, Target, Phone, Mail, Building2,
} from "lucide-react";

const services = [
  {
    title: "AI & Next-Gen Technology",
    short: "AI platforms, chatbots, automation, ML solutions",
    long: "Custom GPT-class chatbots, computer vision, predictive ML models, LLM fine-tuning, RAG pipelines and end-to-end automation built for your industry.",
    icon: Brain,
    route: "/services/ai",
    gradient: "from-violet-500 to-purple-700",
    bullets: ["Custom AI Chatbots", "Computer Vision & OCR", "Predictive Analytics", "Voice & Conversational AI"],
    delivery: "4–10 weeks",
    starting: "₹75,000",
  },
  {
    title: "Cloud & Enterprise Solutions",
    short: "Cloud, SaaS, integrations, migrations",
    long: "AWS · Azure · GCP architecture, zero-downtime migrations, multi-tenant SaaS platforms, ERP/HRMS integrations and 24×7 managed cloud operations.",
    icon: Cloud,
    route: "/services/cloud",
    gradient: "from-sky-500 to-blue-700",
    bullets: ["Multi-Cloud Architecture", "SaaS Platforms", "Cloud Migration", "DevOps & CI/CD"],
    delivery: "3–8 weeks",
    starting: "₹60,000",
  },
  {
    title: "Data & Analytics",
    short: "BI dashboards, data viz, predictive analytics",
    long: "Modern data warehouses, ETL pipelines, beautiful BI dashboards (PowerBI, Tableau, Metabase) and predictive ML models for sales, churn and demand.",
    icon: BarChart3,
    route: "/services/data-analytics",
    gradient: "from-emerald-500 to-teal-700",
    bullets: ["BI Dashboards", "Data Warehousing", "Real-time Insights", "Predictive Models"],
    delivery: "2–6 weeks",
    starting: "₹50,000",
  },
  {
    title: "Cyber Security",
    short: "Network security, monitoring, audits",
    long: "Vulnerability assessments, penetration testing, ISO 27001 / SOC 2 / HIPAA / GDPR compliance, 24/7 SOC monitoring and incident response.",
    icon: Shield,
    route: "/services/cyber-security",
    gradient: "from-rose-500 to-red-700",
    bullets: ["VAPT & Audits", "ISO/SOC Compliance", "24/7 SOC", "Incident Response"],
    delivery: "2–8 weeks",
    starting: "₹40,000",
  },
  {
    title: "Website & Mobile Development",
    short: "Web apps, iOS, Android, e-commerce",
    long: "Marketing websites, SaaS portals, native iOS/Android, React Native & Flutter cross-platform apps, e-commerce stores and PWAs — agency-grade UX.",
    icon: Globe,
    route: "/services/web-mobile",
    gradient: "from-indigo-500 to-blue-700",
    bullets: ["Web & SaaS Apps", "iOS & Android", "E-commerce", "UI/UX Design"],
    delivery: "3–10 weeks",
    starting: "₹35,000",
  },
  {
    title: "CRM & Sales Solutions",
    short: "Industry CRMs, lead mgmt, mobile CRM",
    long: "Real estate, healthcare, education, automobile and retail CRMs with lead capture, sales pipelines, GST invoicing, WhatsApp & ERP integrations.",
    icon: Users,
    route: "/services/crm",
    gradient: "from-orange-500 to-amber-700",
    bullets: ["Industry-Specific CRMs", "Lead & Pipeline", "GST Invoicing", "Mobile CRM App"],
    delivery: "2–6 weeks",
    starting: "₹30,000",
  },
  {
    title: "R Product Suite",
    short: "R Phone, R Dialer, R Bot, R Forms, R Track, R Locate",
    long: "A complete plug-and-play business suite — Cloud IVR, Auto Dialer, AI Chatbot, Survey Forms, Lead Tracker and Field Staff Locator with WhatsApp delivery.",
    icon: Sparkles,
    route: "/services/r-suite",
    gradient: "from-fuchsia-500 to-pink-700",
    bullets: ["Cloud IVR (R Phone)", "AI Chatbot (R Bot)", "Auto Dialer (R Dialer)", "Field Tracking (R Locate)"],
    delivery: "Instant onboarding",
    starting: "₹4,999/mo",
  },
];

const QuoteDialog = ({ defaultService, trigger }: { defaultService?: string; trigger: React.ReactNode }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: defaultService || "", budget: "", message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_messages" as any).insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Quote Request: ${form.service}`,
        message: `Company: ${form.company}\nBudget: ${form.budget}\n\n${form.message}`,
      });
      if (error) throw error;
      toast({ title: "Quote request sent!", description: "Our team will contact you within 24 hours." });
      setOpen(false);
      setForm({ name: "", email: "", phone: "", company: "", service: defaultService || "", budget: "", message: "" });
    } catch (err: any) {
      toast({ title: "Could not submit", description: err.message || "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Get a Free Quote</DialogTitle>
          <DialogDescription>Tell us about your project. We'll respond within 24 hours.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div>
            <Label>Service Required *</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger><SelectValue placeholder="Choose a service" /></SelectTrigger>
              <SelectContent>
                {services.map((s) => <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>)}
                <SelectItem value="Custom / Other">Custom / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Estimated Budget</Label>
            <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
              <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="< ₹50,000">Under ₹50,000</SelectItem>
                <SelectItem value="₹50K - ₹2L">₹50,000 – ₹2,00,000</SelectItem>
                <SelectItem value="₹2L - ₹10L">₹2,00,000 – ₹10,00,000</SelectItem>
                <SelectItem value="₹10L+">₹10,00,000 and above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Project Details</Label>
            <Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Briefly describe your requirements..." />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Quote Request"} <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <AnimatedBackground />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Services</Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Advanced <span className="text-gradient">IT, AI & Business</span> Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From AI platforms and cloud infrastructure to CRM, cyber security, and our R product suite —
              everything your business needs under one roof, delivered by senior engineers.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <QuoteDialog trigger={
                <Button size="lg" variant="hero" className="gap-2">
                  Get a Free Quote <ArrowRight className="h-4 w-4" />
                </Button>
              } />
              <Link to="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" /> Talk to an Expert
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { v: "500+", l: "Projects Delivered" },
                { v: "200+", l: "Happy Clients" },
                { v: "98%", l: "Retention Rate" },
                { v: "24/7", l: "Support" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-heading text-2xl md:text-3xl font-bold text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">7 Service Verticals</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Complete Digital Transformation Stack
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each service includes architecture, design, development, deployment and ongoing support — backed by transparent pricing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="group bg-card border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col">
                  <div className={`h-36 bg-gradient-to-br ${s.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <Icon className="h-16 w-16 text-white relative drop-shadow-lg" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{s.long}</p>
                    <ul className="space-y-2 mb-5">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3 mb-4">
                      <span><Zap className="inline h-3 w-3 mr-1" />{s.delivery}</span>
                      <span className="font-semibold text-primary">From {s.starting}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Link to={s.route} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          Learn More <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      <QuoteDialog
                        defaultService={s.title}
                        trigger={<Button size="sm" className="flex-1">Get Quote</Button>}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Why AADHYRA</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Built for outcomes, not invoices
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Senior Engineers", desc: "No juniors on critical paths. Direct access to architects." },
              { icon: ShieldCheck, title: "Secure by Design", desc: "ISO-aligned, audited, SOC-ready architecture from day one." },
              { icon: TrendingUp, title: "Proven ROI", desc: "Measurable business outcomes with KPIs defined upfront." },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated success manager + always-on helpdesk." },
              { icon: Target, title: "Fixed-Price Options", desc: "Transparent quotes. No hidden costs. GST-compliant invoicing." },
              { icon: Zap, title: "Rapid Delivery", desc: "Most MVPs ship in 2–6 weeks with weekly demo cadence." },
              { icon: Building2, title: "Industry Depth", desc: "Healthcare, BFSI, EdTech, Retail, Logistics & SaaS expertise." },
              { icon: Star, title: "98% Retention", desc: "Clients stay because we deliver — and keep delivering." },
            ].map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-card border rounded-xl p-6 hover:shadow-card-hover transition">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-heading font-bold text-foreground mb-2">{w.title}</h4>
                  <p className="text-sm text-muted-foreground">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Our Process</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              From idea to launch in 4 transparent steps
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, step: "01", title: "Discover", desc: "Free consultation, requirement workshop, success KPIs and a fixed roadmap." },
              { icon: Lightbulb, step: "02", title: "Design", desc: "Architecture, UX flows, interactive prototypes — fully approved before code." },
              { icon: Code2, step: "03", title: "Build", desc: "Agile sprints, weekly demos, full code-on-GitHub transparency." },
              { icon: Rocket, step: "04", title: "Launch & Grow", desc: "Go-live, monitoring, optimization and ongoing scale support." },
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

      {/* Industries */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Industries</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Trusted across 15+ industries
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Healthcare", "Banking & FinTech", "EdTech", "Retail & E-commerce",
              "Real Estate", "Logistics", "Manufacturing", "SaaS",
              "Travel & Hospitality", "Government", "Automobile", "Insurance",
              "Media & Entertainment", "Agritech", "Pharma",
            ].map((i) => (
              <Badge key={i} variant="outline" className="py-2 px-4 text-sm hover:bg-primary hover:text-primary-foreground transition cursor-default">
                {i}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">FAQ</Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="bg-card border rounded-2xl px-6">
            {[
              { q: "How quickly can you start?", a: "After the discovery call, most projects kick off within 5–7 business days. Urgent engagements can start in 48 hours." },
              { q: "Do you sign NDAs and IP agreements?", a: "Yes. All source code, data and IP belong fully to you. Mutual NDAs are signed before any technical discussion." },
              { q: "What is your pricing model?", a: "Fixed-price for defined scope, monthly retainer for ongoing work, or hourly for support. All quotes are GST-compliant with detailed line items." },
              { q: "Do you provide post-launch support?", a: "Every project includes 60 days of free bug-fix support. Extended SLA-backed plans start at ₹15,000/month." },
              { q: "Can I hire dedicated engineers?", a: "Yes — dedicated developers, designers and project managers are available on monthly contracts with full reporting transparency." },
              { q: "Will you work with my existing team?", a: "Absolutely. We integrate with your stand-ups, tools (Slack, Jira, GitHub) and processes seamlessly." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container">
          <div className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-10 md:p-14 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Ready to start your project?</h2>
              <p className="opacity-90 mb-8 max-w-xl mx-auto">
                Get a tailored proposal within 24 hours. Free consultation, transparent pricing, no obligations.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <QuoteDialog trigger={
                  <Button size="lg" variant="accent" className="gap-2">
                    Get Free Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                } />
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10">
                    <Mail className="h-4 w-4" /> Email Us
                  </Button>
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

export default ServicesPage;
