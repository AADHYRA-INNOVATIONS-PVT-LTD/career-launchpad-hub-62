import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, CheckCircle2, ShieldCheck, Smartphone } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, title = "Complete Payment", description = "Secure payment processing" }: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState<"card" | "upi">("upi");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProcessing(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !processing && !success && onClose()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-healthcare/20 rounded-full blur-3xl pointer-events-none" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-healthcare" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="relative z-10 mt-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="h-16 w-16 bg-healthcare/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-healthcare" />
              </div>
              <h3 className="text-lg font-bold text-healthcare mb-1">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="bg-muted/50 p-4 rounded-xl flex items-center justify-between border border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold">₹{amount}</span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethod("upi")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    method === "upi" ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <Smartphone className={`h-6 w-6 ${method === "upi" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${method === "upi" ? "text-primary" : "text-muted-foreground"}`}>UPI / QR</span>
                </button>
                <button
                  onClick={() => setMethod("card")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    method === "card" ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <CreditCard className={`h-6 w-6 ${method === "card" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${method === "card" ? "text-primary" : "text-muted-foreground"}`}>Card</span>
                </button>
              </div>

              {/* Dynamic Input Form */}
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {method === "upi" ? (
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input placeholder="username@upi" className="bg-background/50" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="0000 0000 0000 0000" className="bg-background/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Expiry</Label>
                        <Input placeholder="MM/YY" className="bg-background/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="123" type="password" maxLength={3} className="bg-background/50" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-tech hover:opacity-90 transition-opacity" 
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${amount}`
                )}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Secured by MockPay Integration
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
