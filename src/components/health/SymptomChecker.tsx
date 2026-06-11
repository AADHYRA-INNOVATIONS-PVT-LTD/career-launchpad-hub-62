import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, AlertTriangle, CheckCircle2, ArrowRight, Loader2, Stethoscope, Shield, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PaymentModal from "@/components/shared/PaymentModal";

interface Condition {
  name: string;
  likelihood: "low" | "moderate" | "high";
  description: string;
}

interface AnalysisResult {
  severity: "low" | "moderate" | "high" | "emergency";
  possible_conditions: Condition[];
  recommended_specialist: string;
  immediate_actions: string[];
  questions_to_ask_doctor: string[];
  disclaimer: string;
}

const severityConfig = {
  low: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2, label: "Low" },
  moderate: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle, label: "Moderate" },
  high: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle, label: "High" },
  emergency: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle, label: "Emergency" },
};

const likelihoodColor = {
  low: "bg-muted text-muted-foreground",
  moderate: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (symptoms.trim().length < 10) {
      toast.error("Please describe your symptoms in more detail (at least 10 characters)");
      return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("symptom-checker", {
        body: { symptoms, age: age || undefined, gender: gender || undefined },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
    } catch (e: any) {
      console.error("Symptom analysis error:", e);
      toast.error(e.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms("");
    setAge("");
    setGender("");
    setResult(null);
  };

  if (!user) {
    return (
      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate("/auth?redirect=/placement/health-connect")}>
        Sign In to Check <ArrowRight className="h-3 w-3" />
      </Button>
    );
  }

  if (!hasPaid) {
    return (
      <>
        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setShowPayment(true)}>
          Unlock (₹99) <ArrowRight className="h-3 w-3" />
        </Button>
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={99}
          title="Unlock AI Symptom Checker"
          description="Get unlimited lifetime access to AI health insights."
          onSuccess={() => setHasPaid(true)}
        />
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          Check Now <ArrowRight className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-primary" /> AI Symptom Checker
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>This is an AI-powered preliminary assessment only. It is <strong>not</strong> a medical diagnosis. Always consult a qualified doctor.</span>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Describe your symptoms *</label>
              <Textarea
                placeholder="E.g. I've had a persistent headache for 3 days, mild fever, and body aches..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Age (optional)</label>
                <Input type="number" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} min={1} max={120} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Gender (optional)</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAnalyze} disabled={loading || symptoms.trim().length < 10} className="w-full gap-2" size="lg">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Activity className="h-4 w-4" /> Analyze Symptoms</>}
            </Button>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Severity */}
            {(() => {
              const sev = severityConfig[result.severity];
              const SevIcon = sev.icon;
              return (
                <div className={`rounded-lg border p-4 ${sev.color}`}>
                  <div className="flex items-center gap-2 font-semibold">
                    <SevIcon className="h-5 w-5" /> Severity: {sev.label}
                  </div>
                  {result.severity === "emergency" && (
                    <p className="mt-1 text-sm font-medium">⚠️ Please seek immediate medical attention or call emergency services.</p>
                  )}
                </div>
              );
            })()}

            {/* Possible Conditions */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Possible Conditions</h3>
              <div className="space-y-2">
                {result.possible_conditions.map((c, i) => (
                  <div key={i} className="bg-card border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{c.name}</span>
                      <Badge className={`text-xs ${likelihoodColor[c.likelihood]}`}>{c.likelihood} likelihood</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Specialist */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Recommended Specialist</span>
              </div>
              <p className="text-foreground font-medium">{result.recommended_specialist}</p>
            </div>

            {/* Immediate Actions */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Immediate Actions</h3>
              <ul className="space-y-1.5">
                {result.immediate_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Questions to Ask Your Doctor</h3>
              <ul className="space-y-1.5">
                {result.questions_to_ask_doctor.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold">Q{i + 1}.</span>{q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground border">
              <strong>Disclaimer:</strong> {result.disclaimer}
            </div>

            <div className="flex gap-3">
              <Button onClick={resetForm} variant="outline" className="flex-1">Check Again</Button>
              <Button onClick={() => setOpen(false)} className="flex-1 gap-1">
                Book Doctor <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SymptomChecker;
