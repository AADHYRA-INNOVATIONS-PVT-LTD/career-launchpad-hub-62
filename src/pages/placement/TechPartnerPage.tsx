import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Users, DollarSign, Star, CheckCircle2, ArrowRight, Briefcase, Shield, Clock, Globe, Layers, MessageSquare } from "lucide-react";

const features = [
  { icon: Briefcase, title: "Project Bidding", description: "Browse and bid on projects from verified clients" },
  { icon: Shield, title: "Secure Escrow Payments", description: "Payments held in escrow until project milestones are approved" },
  { icon: Layers, title: "Portfolio Showcase", description: "Build and showcase your portfolio to attract clients" },
  { icon: Star, title: "Ratings & Reviews", description: "Build reputation through client reviews and ratings" },
  { icon: MessageSquare, title: "Project Chat", description: "In-app messaging for real-time collaboration with clients" },
  { icon: Globe, title: "Global Opportunities", description: "Work with clients worldwide from anywhere" },
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
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/10 text-white mb-4">🔹 Shiksha Tech Partner</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Freelancing Marketplace
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Like Upwork — find freelance projects, build your portfolio, and earn. Connect freelancers with project owners.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="accent" size="xl" className="gap-2">
                    <Users className="h-5 w-5" /> Freelancer Login
                  </Button>
                </Link>
                <Link to="/employer/auth">
                  <Button variant="outline" size="xl" className="gap-2 border-white/30 text-white hover:bg-white/10">
                    <Code className="h-5 w-5" /> Project Owner Login
                  </Button>
                </Link>
              </div>
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
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Freelancers</h3>
                <ul className="space-y-3 mb-6">
                  {["Browse projects & bid", "Secure escrow payments", "Build your portfolio", "Get client reviews", "Earn from anywhere"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/auth"><Button className="w-full gap-2">Freelancer Login <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Project Owners</h3>
                <ul className="space-y-3 mb-6">
                  {["Post projects for free", "Browse verified freelancers", "Milestone-based payments", "Real-time project tracking", "Quality guarantees"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/employer/auth"><Button variant="outline" className="w-full gap-2">Project Owner Login <ArrowRight className="h-4 w-4" /></Button></Link>
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
