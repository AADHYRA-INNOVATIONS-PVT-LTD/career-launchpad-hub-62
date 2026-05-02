import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, Code, FileText, Database, Layers, ListChecks, Wand2, Eye, Download, Wand, Smartphone, Tablet, Monitor, Copy, RefreshCw, MessageSquare, Zap, Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  previewHtml?: string;
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
  const [refinePrompt, setRefinePrompt] = useState("");
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [history, setHistory] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your project idea first");
      return;
    }
    setLoading(true);
    setPlan(null);
    setHistory([{ role: "user", text: prompt }]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-lab-builder", {
        body: { prompt },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
      setHistory((h) => [...h, { role: "ai", text: `✨ Built **${data.plan.name}** — ${data.plan.features.length} features, ${data.plan.pages.length} pages.` }]);
      toast.success("Your project plan is ready!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim() || !plan) return;
    setLoading(true);
    const newPrompt = `${prompt}\n\nRefinement: ${refinePrompt}`;
    setHistory((h) => [...h, { role: "user", text: refinePrompt }]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-lab-builder", {
        body: { prompt: newPrompt },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
      setPrompt(newPrompt);
      setRefinePrompt("");
      setHistory((h) => [...h, { role: "ai", text: `🔄 Updated **${data.plan.name}** with your changes.` }]);
      toast.success("Project refined!");
    } catch (err: any) {
      toast.error(err?.message || "Refine failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!plan?.previewHtml) return;
    navigator.clipboard.writeText(plan.previewHtml);
    toast.success("HTML copied to clipboard");
  };

  const deviceWidth = { mobile: "375px", tablet: "768px", desktop: "100%" }[device];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero with prompt */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          <AnimatedBackground />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🔹 AADHYRA LAB</Badge>
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
                <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                  <Zap className="h-3 w-3 mr-1" /> Powered by Gemini
                </Badge>
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
            <div className="container max-w-7xl">
              <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* LEFT — Lovable-style chat sidebar */}
                <div className="bg-card rounded-2xl border shadow-card flex flex-col h-[700px] overflow-hidden">
                  <div className="p-4 border-b bg-gradient-to-br from-primary/5 to-violet-500/5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">AADHYRA LAB chat</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t">
                    <Textarea
                      value={refinePrompt}
                      onChange={(e) => setRefinePrompt(e.target.value)}
                      placeholder="Ask AI to add a feature, change colors, add a page..."
                      rows={2}
                      className="text-sm resize-none mb-2"
                      disabled={loading}
                    />
                    <Button onClick={handleRefine} disabled={loading || !refinePrompt.trim()} size="sm" className="w-full gap-1">
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand className="h-3 w-3" />} Refine
                    </Button>
                  </div>
                </div>

                {/* RIGHT — Lovable-style workspace */}
                <div className="bg-card rounded-2xl border shadow-card overflow-hidden">
                  <div className="bg-gradient-to-br from-primary to-violet-600 text-primary-foreground p-5 flex items-start justify-between gap-4">
                    <div>
                      <Badge className="bg-white/20 text-white border-0 mb-2">Generated · Live</Badge>
                      <h2 className="font-heading text-2xl font-bold">{plan.name}</h2>
                      <p className="text-sm text-primary-foreground/90">{plan.tagline}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-1" onClick={() => { setPlan(null); setPrompt(""); setHistory([]); }}>
                      <RefreshCw className="h-3 w-3" /> New
                    </Button>
                  </div>

                  <Tabs defaultValue="preview" className="w-full">
                    <div className="border-b px-4 flex items-center justify-between flex-wrap gap-2 py-2">
                      <TabsList>
                        <TabsTrigger value="preview" className="gap-1"><Eye className="h-3.5 w-3.5" /> Preview</TabsTrigger>
                        <TabsTrigger value="code" className="gap-1"><Code className="h-3.5 w-3.5" /> Code</TabsTrigger>
                        <TabsTrigger value="files" className="gap-1"><FileText className="h-3.5 w-3.5" /> Files</TabsTrigger>
                        <TabsTrigger value="plan" className="gap-1"><ListChecks className="h-3.5 w-3.5" /> Plan</TabsTrigger>
                      </TabsList>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant={device === "mobile" ? "default" : "ghost"} className="h-8 w-8" onClick={() => setDevice("mobile")}><Smartphone className="h-4 w-4" /></Button>
                        <Button size="icon" variant={device === "tablet" ? "default" : "ghost"} className="h-8 w-8" onClick={() => setDevice("tablet")}><Tablet className="h-4 w-4" /></Button>
                        <Button size="icon" variant={device === "desktop" ? "default" : "ghost"} className="h-8 w-8" onClick={() => setDevice("desktop")}><Monitor className="h-4 w-4" /></Button>
                      </div>
                    </div>

                    <TabsContent value="preview" className="m-0">
                      <div className="bg-slate-100 dark:bg-slate-900 p-4 flex justify-center min-h-[600px]">
                        {plan.previewHtml ? (
                          <iframe
                            title="AI Generated Preview"
                            srcDoc={plan.previewHtml}
                            sandbox="allow-scripts"
                            style={{ width: deviceWidth, maxWidth: "100%" }}
                            className="h-[600px] bg-white rounded-lg shadow-2xl border-0 transition-all"
                          />
                        ) : (
                          <div className="flex items-center justify-center text-muted-foreground">No preview available</div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="code" className="m-0">
                      <div className="bg-slate-950 text-slate-100 max-h-[600px] overflow-auto">
                        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">index.html</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-slate-300 hover:text-white gap-1" onClick={copyCode}>
                              <Copy className="h-3 w-3" /> Copy
                            </Button>
                            <Button
                              size="sm" variant="ghost" className="h-7 text-slate-300 hover:text-white gap-1"
                              onClick={() => {
                                const blob = new Blob([plan.previewHtml!], { type: "text/html" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${plan.name.toLowerCase().replace(/\s+/g, "-")}.html`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <Download className="h-3 w-3" /> Download
                            </Button>
                          </div>
                        </div>
                        <pre className="p-4 text-xs leading-relaxed"><code>{plan.previewHtml}</code></pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="files" className="m-0 p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Project structure</h4>
                          <div className="font-mono text-sm space-y-1 bg-muted/30 rounded-lg p-4">
                            <div className="text-foreground">📁 {plan.name.toLowerCase().replace(/\s+/g, "-")}/</div>
                            <div className="pl-4 text-muted-foreground">├── 📄 index.html</div>
                            <div className="pl-4 text-muted-foreground">├── 📁 src/</div>
                            {plan.pages.map((p, i) => (
                              <div key={p} className="pl-8 text-muted-foreground">{i === plan.pages.length - 1 ? "└──" : "├──"} 📄 {p.toLowerCase().replace(/\s+/g, "-")}.tsx</div>
                            ))}
                            <div className="pl-4 text-muted-foreground">├── 📁 components/</div>
                            <div className="pl-4 text-muted-foreground">├── 📄 package.json</div>
                            <div className="pl-4 text-muted-foreground">└── 📄 tailwind.config.ts</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Database tables</h4>
                          <div className="space-y-2">
                            {plan.dataModel.map((d) => (
                              <div key={d.table} className="rounded-lg border bg-background p-3">
                                <div className="font-mono text-sm font-bold text-primary mb-1.5 flex items-center gap-1.5">
                                  <Database className="h-3.5 w-3.5" /> {d.table}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {d.fields.map((f) => (
                                    <Badge key={f} variant="secondary" className="text-[10px] font-mono">{f}</Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="plan" className="m-0 p-6 space-y-6">
                      <p className="text-muted-foreground">{plan.description}</p>
                      <div>
                        <div className="flex items-center gap-2 mb-3"><Layers className="h-5 w-5 text-primary" /><h3 className="font-heading font-semibold">Tech Stack</h3></div>
                        <div className="flex flex-wrap gap-2">{plan.techStack.map((t) => (<Badge key={t} variant="outline">{t}</Badge>))}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3"><Wand2 className="h-5 w-5 text-primary" /><h3 className="font-heading font-semibold">Features</h3></div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {plan.features.map((f) => (
                            <div key={f} className="flex items-start gap-2 text-sm bg-muted/40 rounded-lg p-3">
                              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /><span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3"><ListChecks className="h-5 w-5 text-primary" /><h3 className="font-heading font-semibold">Next Steps</h3></div>
                        <ol className="space-y-2">
                          {plan.nextSteps.map((s, i) => (
                            <li key={s} className="flex gap-3 text-sm">
                              <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs flex-shrink-0">{i + 1}</span>
                              <span className="text-foreground">{s}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="border-t bg-muted/30 p-4 flex flex-wrap gap-2 justify-end">
                    <Button variant="outline" size="sm" className="gap-1" onClick={copyCode}><Github className="h-3.5 w-3.5" /> Export</Button>
                    <Link to="/auth"><Button size="sm" className="gap-1"><Sparkles className="h-3.5 w-3.5" /> Save & Deploy</Button></Link>
                  </div>
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
              <p className="text-muted-foreground">Everything else our AADHYRA LAB can do for your career</p>
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
