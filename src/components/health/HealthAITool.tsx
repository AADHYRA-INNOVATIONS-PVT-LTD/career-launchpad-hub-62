import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
            <Button onClick={run} disabled={loading} className="w-full gap-2" size="lg">
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
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1">Try Again</Button>
              <Button onClick={() => setOpen(false)} className="flex-1">Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HealthAITool;