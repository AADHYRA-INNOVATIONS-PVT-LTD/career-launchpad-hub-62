import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Wallet, Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  price: number;
}

interface Props {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (details: BuyerDetails) => Promise<void>;
  defaultEmail?: string;
  defaultName?: string;
}

export interface BuyerDetails {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
}

const schema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  college: z.string().trim().min(2, "College/Institution is required").max(150),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet"]),
});

const ProjectCheckoutDialog = ({ project, open, onClose, onConfirm, defaultEmail, defaultName }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BuyerDetails>({
    fullName: defaultName || "",
    email: defaultEmail || "",
    phone: "",
    college: "",
    paymentMethod: "upi",
  });

  if (!project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check your details",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm(parsed.data);
    } finally {
      setSubmitting(false);
    }
  };

  const methods = [
    { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", desc: "All major Indian banks", icon: Building2 },
    { id: "wallet", label: "Wallet", desc: "Paytm, Mobikwik, Amazon Pay", icon: Wallet },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Complete Your Purchase
          </DialogTitle>
          <DialogDescription>
            Fill your details and choose a payment option to unlock full access to this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order summary */}
          <div className="rounded-lg border bg-muted/30 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">You are buying</p>
              <p className="font-semibold truncate">{project.title}</p>
            </div>
            <p className="text-2xl font-bold text-primary">₹{project.price.toLocaleString()}</p>
          </div>

          {/* Buyer details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile Number *</Label>
              <Input id="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="10-digit number" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="college">College / Institution *</Label>
              <Input id="college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="College name" />
            </div>
          </div>

          <Separator />

          {/* Payment method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup
              value={form.paymentMethod}
              onValueChange={(v) => setForm({ ...form, paymentMethod: v as BuyerDetails["paymentMethod"] })}
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
              {methods.map((m) => {
                const Icon = m.icon;
                const active = form.paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    htmlFor={`pm-${m.id}`}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/40"}`}
                  >
                    <RadioGroupItem id={`pm-${m.id}`} value={m.id} />
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.desc}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* What you get */}
          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-healthcare mt-0.5 flex-shrink-0" />
            <span>
              After payment you'll instantly unlock <strong>source code, documentation, PPT, synopsis</strong> and the <strong>demo video</strong>, plus a GST-ready invoice.
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Pay ₹{project.price.toLocaleString()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCheckoutDialog;