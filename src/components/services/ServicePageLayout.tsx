import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Play, Sparkles, LucideIcon } from "lucide-react";

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
                </div>
              )}
            </div>
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
