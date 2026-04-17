import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Cloud, BarChart3, Shield, Globe, Users, Sparkles } from "lucide-react";

const services = [
  { title: "AI & Next-Gen Technology", description: "AI platforms, chatbots, automation, ML solutions", icon: Brain, route: "/services/ai", gradient: "from-violet-500 to-purple-700" },
  { title: "Cloud & Enterprise Solutions", description: "Cloud, SaaS, integrations, migrations", icon: Cloud, route: "/services/cloud", gradient: "from-sky-500 to-blue-700" },
  { title: "Data & Analytics", description: "BI dashboards, data viz, predictive analytics", icon: BarChart3, route: "/services/data-analytics", gradient: "from-emerald-500 to-teal-700" },
  { title: "Cyber Security", description: "Network security, monitoring, audits", icon: Shield, route: "/services/cyber-security", gradient: "from-rose-500 to-red-700" },
  { title: "Website & Mobile Development", description: "Web apps, iOS, Android, e-commerce", icon: Globe, route: "/services/web-mobile", gradient: "from-indigo-500 to-blue-700" },
  { title: "CRM & Sales Solutions", description: "Industry CRMs, lead mgmt, mobile CRM", icon: Users, route: "/services/crm", gradient: "from-orange-500 to-amber-700" },
  { title: "R Product Suite", description: "R Phone, R Dialer, R Bot, R Forms, R Track, R Locate", icon: Sparkles, route: "/services/r-suite", gradient: "from-fuchsia-500 to-pink-700" },
];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <AnimatedBackground />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Services</Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Advanced <span className="text-gradient">IT, AI & Business</span> Services
            </h1>
            <p className="text-lg text-muted-foreground">
              From AI platforms and cloud infrastructure to CRM, cyber security, and our R product suite — everything your
              business needs under one roof.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.title} to={s.route} className="group">
                  <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className={`h-32 bg-gradient-to-br ${s.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 grid-pattern opacity-30" />
                      <Icon className="h-14 w-14 text-white relative" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                      <Button variant="outline" size="sm" className="gap-2">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default ServicesPage;
