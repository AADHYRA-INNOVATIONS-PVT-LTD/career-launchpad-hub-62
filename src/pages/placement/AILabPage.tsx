import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, Code, FileText, Database, Layers, ListChecks, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectPlan {
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  pages: string[];
  dataModel: { table: string; fields: string[] }[];
  nextSteps: string[];
}

const examples = [
  "Build a portfolio website with contact form and dark mode",
  "Create an e-commerce app for handmade jewelry with Razorpay checkout",
  "A SaaS dashboard for tracking gym workouts with charts",
  "A blog platform with markdown support and AI summary",
];

const AILabPage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your project idea first");
      return;
    }
    setLoading(true);
    setPlan(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-lab-builder", {
        body: { prompt },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
      toast.success("Your project plan is ready!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero with prompt */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          <AnimatedBackground />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🔹 Shiksha AI Lab</Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Prompt to <span className="text-gradient">Project</span> in seconds
              </h1>
              <p className="text-lg text-muted-foreground">
                Describe what you want to build. Our AI plans the features, pages, tech stack, and data model — just like
                Lovable.
              </p>
            </div>

            {/* Prompt box */}
            <div className="max-w-3xl mx-auto bg-card rounded-3xl border-2 border-primary/20 shadow-card-hover p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">AI Project Builder</h3>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Build a marketplace where freelance designers can sell logo templates with Stripe checkout..."
                rows={4}
                className="mb-4 text-base resize-none"
                disabled={loading}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {examples.map((eg) => (
                  <button
                    key={eg}
                    type="button"
                    disabled={loading}
                    onClick={() => setPrompt(eg)}
                    className="px-3 py-1.5 text-xs rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {eg}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerate} disabled={loading} size="lg" className="gap-2 flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating your project...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Generate Project Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Result */}
        {plan && (
          <section className="py-16">
            <div className="container max-w-5xl">
              <div className="bg-card rounded-3xl border shadow-card-hover overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-violet-600 text-primary-foreground p-8">
                  <Badge className="bg-white/20 text-white border-0 mb-3">Generated Project</Badge>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-lg text-primary-foreground/90 mb-3">{plan.tagline}</p>
                  <p className="text-primary-foreground/80">{plan.description}</p>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-semibold">Tech Stack</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.techStack.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-semibold">Pages</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.pages.map((p) => (
                        <li key={p} className="text-sm text-foreground flex items-center gap-2">
                          <Code className="h-3.5 w-3.5 text-primary" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-semibold">Features</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-sm bg-muted/40 rounded-lg p-3">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-semibold">Data Model</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {plan.dataModel.map((d) => (
                        <div key={d.table} className="rounded-lg border bg-background p-4">
                          <div className="font-mono text-sm font-bold text-primary mb-2">{d.table}</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {d.fields.map((f) => (
                              <li key={f} className="font-mono">• {f}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-semibold">Next Steps</h3>
                    </div>
                    <ol className="space-y-2">
                      {plan.nextSteps.map((s, i) => (
                        <li key={s} className="flex gap-3 text-sm">
                          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-foreground">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="border-t bg-muted/30 p-6 flex flex-wrap gap-3 justify-center">
                  <Link to="/auth">
                    <Button size="lg" className="gap-2">
                      <Sparkles className="h-4 w-4" /> Sign in to save & build
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" onClick={() => { setPlan(null); setPrompt(""); }}>
                    Generate another
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Tools strip */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">More AI Tools</h2>
              <p className="text-muted-foreground">Everything else our AI Lab can do for your career</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: "AI Resume Builder", d: "ATS-friendly resumes in minutes" },
                { t: "Mock Interview AI", d: "Practice with instant feedback" },
                { t: "Code Playground", d: "10+ languages with AI assist" },
                { t: "Career Path AI", d: "Personalized guidance" },
              ].map((x) => (
                <div key={x.t} className="bg-card border rounded-xl p-5 hover:shadow-card-hover transition">
                  <Sparkles className="h-5 w-5 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground">{x.t}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{x.d}</p>
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

export default AILabPage;
