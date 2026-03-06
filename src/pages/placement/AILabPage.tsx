import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Code, FileText, Video, Palette, ArrowRight, CheckCircle2, Zap, Wand2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const aiTools = [
  { icon: FileText, title: "AI Resume Builder", description: "Generate ATS-friendly professional resumes with AI suggestions", color: "primary", badge: "Popular" },
  { icon: Video, title: "Mock Interview AI", description: "Practice interviews with AI interviewer, get instant feedback", color: "primary", badge: "New" },
  { icon: Code, title: "Code Playground", description: "Write, run, and debug code with AI assistance across 10+ languages", color: "primary", badge: "Beta" },
  { icon: Brain, title: "Career Path AI", description: "AI-powered career recommendations based on your skills and goals", color: "primary", badge: "" },
  { icon: Palette, title: "Design Generator", description: "Generate logos, banners, and social media creatives with AI", color: "primary", badge: "" },
  { icon: Wand2, title: "Project Builder", description: "Describe your project idea, AI generates the complete codebase", color: "primary", badge: "Featured" },
];

const AILabPage = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/10 text-white mb-4">🔹 Shiksha AI Lab</Badge>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                AI-Powered Builder Platform
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Give a prompt, get a project. AI resume builder, mock interviews, code playground, and career tools — all in one place.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="accent" size="xl" className="gap-2">
                    <Sparkles className="h-5 w-5" /> Start Building
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Prompt Box */}
        <section className="py-12 border-b">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-2xl border-2 border-primary/20 shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground">Try AI Project Builder</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Describe your project and our AI will generate the code for you</p>
                <div className="flex gap-2">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Build a portfolio website with contact form..."
                    className="flex-1"
                  />
                  <Link to="/auth">
                    <Button className="gap-2">
                      <Send className="h-4 w-4" /> Generate
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Portfolio Website", "E-commerce App", "Blog Platform", "Dashboard"].map((eg) => (
                    <button
                      key={eg}
                      onClick={() => setPrompt(`Build a ${eg.toLowerCase()}`)}
                      className="px-3 py-1 text-xs rounded-full border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                    >
                      {eg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tools */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">AI Tools & Features</h2>
              <p className="text-muted-foreground">Everything powered by AI to accelerate your career</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.title} className="bg-card rounded-xl border shadow-card p-6 hover:shadow-card-hover transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {tool.badge && <Badge className="bg-primary/10 text-primary text-xs">{tool.badge}</Badge>}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <Link to="/auth">
                      <Button variant="outline" size="sm" className="gap-1">
                        Try Now <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">How AI Lab Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { step: "1", title: "Give a Prompt", desc: "Describe what you want to build or create", icon: "💬" },
                { step: "2", title: "AI Generates", desc: "Our AI processes your request and generates output", icon: "⚡" },
                { step: "3", title: "Download & Use", desc: "Get your project, resume, or design instantly", icon: "📥" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <Badge variant="outline" className="mb-3">Step {s.step}</Badge>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="gap-2">
                  <Zap className="h-5 w-5" /> Start Using AI Lab
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AILabPage;
