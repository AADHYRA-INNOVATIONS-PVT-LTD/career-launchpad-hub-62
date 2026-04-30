import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  type: "resume_summary" | "portfolio_bio" | "project_description" | "skill_suggest" | "experience_bullet";
  context: string;
  onResult: (text: string) => void;
  label?: string;
  size?: "sm" | "default";
}

const AIAssistButton = ({ type, context, onResult, label = "AI Write", size = "sm" }: Props) => {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!context || context.trim().length < 2) {
      toast.error("Add a short hint first (e.g. your role/keywords)");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-text-assist", { body: { type, input: context } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onResult((data.text || "").trim());
      toast.success("AI generated content!");
    } catch (e: any) {
      toast.error(e.message || "AI failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size={size} onClick={run} disabled={loading} className="gap-1">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
};

export default AIAssistButton;