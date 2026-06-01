import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Users, Briefcase, ArrowRight, CheckCircle2, Shield, Star, Layers, MessageSquare, Globe, Building2 } from "lucide-react";

const features = [
  { icon: Briefcase, title: "Project Bidding", description: "Browse and bid on projects from verified clients" },
  { icon: Shield, title: "Secure Escrow Payments", description: "Payments held in escrow until milestones approved" },
  { icon: Layers, title: "Portfolio Showcase", description: "Build and showcase your portfolio to attract clients" },
  { icon: Star, title: "Ratings & Reviews", description: "Build reputation through client reviews" },
  { icon: MessageSquare, title: "Project Chat", description: "In-app messaging for real-time collaboration" },
  { icon: Globe, title: "Global Opportunities", description: "Work with clients worldwide" },
];

const projectCategories = [
  { name: "Web Development", count: "120+", icon: "🌐" },
  { name: "Mobile Apps", count: "85+", icon: "📱" },
  { name: "UI/UX Design", count: "95+", icon: "🎨" },
  { name: "Digital Marketing", count: "70+", icon: "📈" },
  { name: "Data Analytics", count: "45+", icon: "📊" },
  { name: "Content Writing", count: "110+", icon: "✍️" },
];

const TechPartnerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero with animated bg */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <AnimatedBackground />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🔹 AADHYRA TECH PARTNER</Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Freelancing Marketplace
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Like Upwork — find freelance projects, build your portfolio, and earn. Connect freelancers with project owners.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {/* Pass freelancer role to render the Freelancer configuration */}
                <Link to="/auth?role=freelancer">
                  <Button size="xl" className="gap-2">
                    <Users className="h-5 w-5" /> Freelancer Login
                  </Button>
                </Link>
                {/* Pass employer role to switch over to the Project Owner setup */}
                <Link to="/auth?role=employer">
                  <Button size="xl" variant="outline" className="gap-2">
                    <Building2 className="h-5 w-5" /> Project Owner Login
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                New here? <Link to="/auth?role=candidate" className="text-primary hover:underline">Sign up as Freelancer</Link> · <Link to="/auth?role=employer" className="text-primary hover:underline">Register as Project Owner</Link>
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                New here? <Link to="/auth" className="text-primary hover:underline">Sign up as Freelancer</Link> · <Link to="/employer/register" className="text-primary hover:underline">Register as Project Owner</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Project Categories */}
        <section className="py-12 border-b">
          <div className="container">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {projectCategories.map((cat) => (
                <div key={cat.name} className="bg-card rounded-xl border p-4 text-center hover:shadow-card-hover transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-sm text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} projects</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Platform Features</h2>
              <p className="text-muted-foreground">Everything you need to succeed as a freelancer</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all">
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

        {/* Two Login CTAs */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border-2 border-primary/20 shadow-card p-8">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Freelancers</h3>
                <ul className="space-y-3 mb-6">
                  {["Browse projects & bid", "Secure escrow payments", "Build your portfolio", "Get client reviews", "Earn from anywhere"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                {/* For Freelancers Card Button */}
                <Link to="/auth?role=candidate"><Button className="w-full gap-2">Freelancer Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="bg-card rounded-2xl border-2 border-accent/20 shadow-card p-8">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Project Owners</h3>
                <ul className="space-y-3 mb-6">
                  {["Post projects for free", "Browse verified freelancers", "Milestone-based payments", "Real-time project tracking", "Quality guarantees"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                {/* For Project Owners Card Button */}
                <Link to="/auth?role=employer"><Button variant="outline" className="w-full gap-2">Project Owner Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TechPartnerPage;
