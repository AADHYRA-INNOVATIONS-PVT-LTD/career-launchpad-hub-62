import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CreditCard, CheckCircle2, Briefcase, FileText, Camera, Video, IndianRupee } from "lucide-react";
import PaymentModal from "@/components/shared/PaymentModal";

interface ApplyDialogProps {
  job: { title: string; company: string; experience: string; salary: string };
  open: boolean;
  onClose: () => void;
}

const hiringSteps = [
  { step: 1, title: "Select Role", icon: Briefcase },
  { step: 2, title: "Pay Evaluation Fee", icon: CreditCard },
  { step: 3, title: "Registration Form", icon: FileText },
  { step: 4, title: "MCQ Test (Proctored)", icon: CheckCircle2 },
  { step: 5, title: "Technical Round", icon: Video },
  { step: 6, title: "AI HR Interview", icon: Camera },
];

const ApplyDialog = ({ job, open, onClose }: ApplyDialogProps) => {
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced" | null>(null);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!open) return null;

  const fee = experienceLevel === "fresher" ? 300 : 700;

  const handleProceed = () => {
    if (step === "select" && experienceLevel) {
      setStep("confirm");
    } else if (step === "confirm") {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    window.location.href = "/auth?message=payment_success";
  };

  const handleClose = () => {
    setStep("select");
    setExperienceLevel(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={handleClose}>
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl border" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gradient-hero text-primary-foreground p-6">
          <h3 className="font-heading text-xl font-bold">{job.title}</h3>
          <p className="text-sm text-primary-foreground/70 mt-1">{job.company}</p>
          <div className="flex items-center gap-3 mt-3 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">{job.salary}</Badge>
            <Badge className="bg-white/20 text-white border-white/30">{job.experience}</Badge>
          </div>
        </div>

        {step === "select" ? (
          <div className="p-6">
            <h4 className="font-heading font-semibold text-foreground mb-4">Select Your Experience Level</h4>
            <p className="text-sm text-muted-foreground mb-6">Evaluation fee depends on your experience</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setExperienceLevel("fresher")}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  experienceLevel === "fresher"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">🎓</div>
                <h5 className="font-semibold text-foreground">Fresher</h5>
                <p className="text-xs text-muted-foreground mt-1">0-1 year experience</p>
                <div className="flex items-center gap-1 mt-3 text-primary font-bold text-lg">
                  <IndianRupee className="h-4 w-4" />300
                </div>
              </button>

              <button
                onClick={() => setExperienceLevel("experienced")}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  experienceLevel === "experienced"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">💼</div>
                <h5 className="font-semibold text-foreground">Experienced</h5>
                <p className="text-xs text-muted-foreground mt-1">1+ year experience</p>
                <div className="flex items-center gap-1 mt-3 text-primary font-bold text-lg">
                  <IndianRupee className="h-4 w-4" />700
                </div>
              </button>
            </div>

            <Button
              onClick={handleProceed}
              disabled={!experienceLevel}
              className="w-full gap-2"
              size="lg"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <h4 className="font-heading font-semibold text-foreground mb-2">Confirm & Pay</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Pay ₹{fee} evaluation fee to start the hiring process
            </p>

            {/* Steps preview */}
            <div className="space-y-3 mb-6">
              {hiringSteps.map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.step}
                  </div>
                  <div className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{s.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Evaluation Fee</p>
                  <p className="text-xs text-muted-foreground">{experienceLevel === "fresher" ? "Fresher (0-1 yr)" : "Experienced (1+ yr)"}</p>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold text-xl">
                  <IndianRupee className="h-5 w-5" />
                  {fee}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleProceed} className="flex-1 gap-2">
                <CreditCard className="h-4 w-4" /> Pay ₹{fee}
              </Button>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={fee}
        onSuccess={handlePaymentSuccess}
        title="Application Evaluation Fee"
        description={`Pay ₹${fee} to start the hiring process for ${job.title}`}
      />
    </div>
  );
};

export default ApplyDialog;
