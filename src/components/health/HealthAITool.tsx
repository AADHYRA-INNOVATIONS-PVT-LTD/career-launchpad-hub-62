import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, Bot, Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PaymentModal from "@/components/shared/PaymentModal";

type ToolKey = "skin" | "hair" | "bmi" | "diabetes" | "stress" | "sleep" | "diet" | "chat";

interface Props {
  tool: ToolKey;
  title: string;
  triggerLabel?: string;
  triggerSize?: "sm" | "default" | "lg";
  triggerVariant?: "default" | "outline" | "secondary";
  placeholder: string;
  fullButton?: boolean;
}

const HealthAITool = ({ tool, title, triggerLabel = "Try Now", triggerSize = "sm", triggerVariant = "outline", placeholder, fullButton }: Props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const run = async () => {
    if (input.trim().length < 5) {
      toast.error("Please add a bit more detail");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("health-ai", { body: { tool, input } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e: any) {
      toast.error(e.message || "AI failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setInput(""); setResult(null); };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AADHYRA HEALTH CONNECT", margin, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("AI Health Report", margin, 50);
    y = 100;

    // Title
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, margin, y);
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 20;

    // Input section
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Your Input:", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const inputLines = doc.splitTextToSize(input, pageW - margin * 2);
    doc.text(inputLines, margin, y);
    y += inputLines.length * 12 + 14;

    // Result section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("AI Analysis:", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const resultLines = doc.splitTextToSize(result, pageW - margin * 2);
    for (const line of resultLines) {
      if (y > pageH - 60) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 12;
    }

    // Footer disclaimer on each page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Disclaimer: For informational purposes only. Consult a qualified doctor for medical advice.",
        margin,
        pageH - 30
      );
      doc.text(`Page ${i} of ${pageCount}  |  AADHYRA INNOVATIONS PVT LTD`, margin, pageH - 18);
    }

    const fileName = `aadhyra-health-${tool}-${Date.now()}.pdf`;
    doc.save(fileName);
    toast.success("Report downloaded");
  };

  const shareReport = async () => {
    if (!result) return;
    const text = `AADHYRA HEALTH CONNECT — ${title}\n\nInput:\n${input}\n\nAI Analysis:\n${result}\n\n— Powered by AADHYRA AI`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `AADHYRA Health Report — ${title}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Report copied to clipboard");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") toast.error("Could not share report");
    }
  };

  if (!user) {
    return (
      <Button size={triggerSize} variant={triggerVariant} className={`gap-1 ${fullButton ? "w-full" : "text-xs"}`} onClick={() => navigate("/auth?redirect=/placement/health-connect")}>
        Sign In to Check <ArrowRight className="h-3 w-3" />
      </Button>
    );
  }

  if (!hasPaid) {
    return (
      <>
        <Button size={triggerSize} variant={triggerVariant} className={`gap-1 ${fullButton ? "w-full" : "text-xs"}`} onClick={() => setShowPayment(true)}>
          Unlock (₹49) <ArrowRight className="h-3 w-3" />
        </Button>
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={49}
          title={`Unlock ${title}`}
          description="Get premium AI health analysis."
          onSuccess={() => setHasPaid(true)}
        />
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size={triggerSize} variant={triggerVariant} className={`gap-1 ${fullButton ? "w-full" : "text-xs"}`}>
          {triggerLabel} <ArrowRight className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" /> {title}
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 pt-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">Powered by AADHYRA AI</Badge>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={5}
              className="resize-none"
            />
            <Button onClick={run} disabled={loading || input.trim().length < 5} className="w-full gap-2" size="lg">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Get AI Analysis</>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              ⚕️ For informational purposes. Always consult a qualified doctor.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="prose prose-sm max-w-none bg-muted/30 rounded-lg p-4 whitespace-pre-wrap text-sm text-foreground">
              {result}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadPDF} variant="default" className="gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              <Button onClick={shareReport} variant="secondary" className="gap-2">
                <Share2 className="h-4 w-4" /> Share Report
              </Button>
              <Button onClick={reset} variant="outline">Try Again</Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              ⚕️ For informational purposes. Always consult a qualified doctor.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HealthAITool;