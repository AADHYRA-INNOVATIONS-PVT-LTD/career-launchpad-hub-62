import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Briefcase, Star, CheckCircle2, ArrowRight, Building2, TrendingUp, Shield, FileText, Bell, MessageSquare } from "lucide-react";

const features = [
  { icon: Search, title: "AI Skill Matching", description: "Our AI matches your skills with the right job opportunities automatically" },
  { icon: Bell, title: "Smart Job Alerts", description: "Get notified instantly when jobs matching your profile are posted" },
  { icon: Shield, title: "Verified Profiles", description: "All candidates go through skill assessment to create verified profiles" },
  { icon: MessageSquare, title: "In-App Messaging", description: "Chat directly with employers and schedule interviews" },
  { icon: FileText, title: "Resume Builder", description: "AI-powered resume builder creates ATS-friendly resumes" },
  { icon: TrendingUp, title: "Career Growth Tracking", description: "Track your applications, interviews, and career progress" },
];

const TalentConnectPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/10 text-white mb-4">🔹 AADHYRA TALENT CONNECT</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                AI-Powered Recruitment Platform
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Like Apna — connecting trained professionals with top companies through smart job matching and verified candidate profiles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              {/* Passes candidate role context to the central auth router */}
              <Link to="/auth?role=candidate" className="w-full sm:w-auto">
                <Button variant="accent" size="xl" className="w-full sm:w-auto gap-2">
                  <Users className="h-5 w-5" /> Employee Login
                </Button>
              </Link>
              {/* Passes employer role context to trigger the specialized business layout */}
              <Link to="/auth?role=employer" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">Employer Login <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b bg-card py-6">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="font-semibold">5,000+</span> placements</div>
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /><span className="font-semibold">500+</span> companies</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" /><span className="font-semibold">₹8 LPA</span> avg salary</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">How It Works</h2>
              <p className="text-muted-foreground">Smart hiring for candidates and employers</p>
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
                <div className="text-4xl mb-4">👤</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Employees</h3>
                <ul className="space-y-3 mb-6">
                  {["Create verified profile", "AI job matching", "Track applications", "In-app messaging", "Interview scheduling"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                {/* For Candidates Card Button */}
              <Link to="/auth?role=candidate">
                <Button className="w-full gap-2">Employee Login <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              </div>
              <div className="bg-card rounded-2xl border shadow-card p-8">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">For Employers</h3>
                <ul className="space-y-3 mb-6">
                  {["Post unlimited jobs", "AI candidate matching", "Manage applications", "Schedule interviews", "Verified skill reports"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link to="/employer/auth">
                  <Button variant="outline" className="w-full gap-2">Employer Login <ArrowRight className="h-4 w-4" /></Button>
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

export default TalentConnectPage;
