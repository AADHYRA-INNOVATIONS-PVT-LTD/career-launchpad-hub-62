import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Code, Heart, Brain, Users, Building2, MapPin, Sparkles } from "lucide-react";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import bgTalent from "@/assets/card-bg-talent.jpg";
import bgTech from "@/assets/card-bg-tech.jpg";
import bgHealth from "@/assets/card-bg-health.jpg";
import bgAiLab from "@/assets/card-bg-ailab.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container relative py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-healthcare animate-pulse" />
            <span className="text-sm font-medium">One Unified Platform · 4 Powerful Products</span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            The Complete{" "}
            Career Ecosystem
          </h1>

          <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Talent hiring · Freelance projects · AI healthcare · AI project builder — all under one roof
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/apply">
              <Button variant="accent" size="xl" className="group">
                Apply Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/placement">
              <Button variant="heroOutline" size="xl">
                Explore Ecosystem
              </Button>
            </Link>
          </div>
        </div>

        {/* Product showcase grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {/* AADHYRA TALENT CONNECT */}
          <ProductCard
            title="AADHYRA TALENT CONNECT"
            tagline="AI Recruitment · Pan-India Hiring"
            icon={Search}
            gradient="from-blue-500/30 to-primary/40"
            ringColor="ring-blue-300/40"
            bgImage={bgTalent}
            features={[
              { icon: MapPin, text: "Pan-India job opportunities for candidates" },
              { icon: Building2, text: "Employers find verified talent fast" },
              { icon: Users, text: "Campus & placement drives across India" },
              { icon: Sparkles, text: "Upcoming: Employer onboarding open now" },
            ]}
            primaryCta={{ label: "Candidate Login", to: "/auth" }}
            secondaryCta={{ label: "Employer Login", to: "/employer/auth" }}
            learnMore="/placement/talent-connect"
          />

          {/* AADHYRA TECH PARTNER */}
          <ProductCard
            title="AADHYRA TECH PARTNER"
            tagline="Freelance Marketplace · Like Upwork"
            icon={Code}
            gradient="from-emerald-400/30 to-teal-500/40"
            ringColor="ring-emerald-300/40"
            bgImage={bgTech}
            features={[
              { icon: Code, text: "Bid on real freelance projects" },
              { icon: Building2, text: "Project owners post & hire securely" },
              { icon: Sparkles, text: "Escrow payments + portfolio showcase" },
              { icon: Users, text: "Verified freelancers across India" },
            ]}
            primaryCta={{ label: "Freelancer Login", to: "/auth" }}
            secondaryCta={{ label: "Project Owner Login", to: "/employer/auth" }}
            learnMore="/placement/tech-partner"
          />

          {/* AADHYRA HEALTH CONNECT */}
          <ProductCard
            title="AADHYRA HEALTH CONNECT"
            tagline="AI Healthcare · Telemedicine"
            icon={Heart}
            gradient="from-cyan-400/30 to-blue-500/40"
            ringColor="ring-cyan-300/40"
            bgImage={bgHealth}
            features={[
              { icon: Sparkles, text: "AI symptom checker & health scans" },
              { icon: Users, text: "Online doctor consultations 24/7" },
              { icon: Heart, text: "Lab tests, pharmacy & home nursing" },
              { icon: Building2, text: "Doctors & nurses join the network" },
            ]}
            primaryCta={{ label: "Patient Login", to: "/auth" }}
            secondaryCta={{ label: "Doctor / Nurse Login", to: "/employer/auth" }}
            learnMore="/placement/health-connect"
          />

          {/* AADHYRA LAB */}
          <ProductCard
            title="AADHYRA LAB"
            tagline="Prompt → Project Builder"
            icon={Brain}
            gradient="from-violet-400/30 to-purple-600/40"
            ringColor="ring-violet-300/40"
            bgImage={bgAiLab}
            features={[
              { icon: Sparkles, text: "Describe an idea — AI builds the plan" },
              { icon: Code, text: "Tech stack, pages & data model auto-generated" },
              { icon: Brain, text: "Resume, mock interview & career path AI" },
              { icon: Users, text: "Free to try — no signup required" },
            ]}
            primaryCta={{ label: "Open AADHYRA LAB", to: "/placement/ai-lab" }}
            secondaryCta={{ label: "Learn More", to: "/placement" }}
            learnMore="/placement/ai-lab"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <Stat value="5,000+" label="Students Placed" />
          <Stat value="500+" label="Hiring Partners" />
          <Stat value="95%" label="Placement Rate" />
          <Stat value="50+" label="Hospital Partners" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

type Feature = { icon: React.ComponentType<{ className?: string }>; text: string };
type Cta = { label: string; to: string };

const ProductCard = ({
  title,
  tagline,
  icon: Icon,
  gradient,
  ringColor,
  bgImage,
  features,
  primaryCta,
  secondaryCta,
  learnMore,
}: {
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  ringColor: string;
  bgImage: string;
  features: Feature[];
  primaryCta: Cta;
  secondaryCta: Cta;
  learnMore: string;
}) => {
  return (
    <div className={`group relative rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 ring-1 ${ringColor} hover:bg-white/10 transition-all duration-500 overflow-hidden hover:-translate-y-1`}>
      {/* Hero background image with slow Ken Burns motion */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1024}
        height={640}
        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[6000ms] ease-out animate-[float_12s_ease-in-out_infinite]"
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-background/85" />
      {/* Brand color tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500 mix-blend-overlay`} />
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all" />

      <div className="relative p-6 md:p-7">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-tight">{title}</h3>
            <p className="text-xs md:text-sm text-white/70 mt-0.5">{tagline}</p>
          </div>
        </div>

        <ul className="space-y-2 mb-5">
          {features.map((f) => {
            const FIcon = f.icon;
            return (
              <li key={f.text} className="flex items-start gap-2.5 text-sm text-white/85">
                <FIcon className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{f.text}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Link to={primaryCta.to} className="flex-1 min-w-[140px]">
            <Button variant="accent" size="sm" className="w-full">
              {primaryCta.label}
            </Button>
          </Link>
          <Link to={secondaryCta.to} className="flex-1 min-w-[140px]">
            <Button variant="heroOutline" size="sm" className="w-full">
              {secondaryCta.label}
            </Button>
          </Link>
        </div>

        <Link to={learnMore} className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mt-3 group/link">
          Learn more
          <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl md:text-4xl font-heading font-bold">{value}</div>
    <div className="text-xs md:text-sm text-white/70 mt-1">{label}</div>
  </div>
);

export default HeroSection;
