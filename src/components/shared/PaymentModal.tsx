import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Add Razorpay typing to Window
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    try {
      setProcessing(true);
      
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount }
      });

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key', // Uses env var or fallback for UI testing
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AADHYRA INNOVATIONS",
        description: title,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setProcessing(true);
            // Verify payment
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verificationError || !verificationData?.success) {
              throw new Error("Payment verification failed");
            }

            setSuccess(true);
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 1500);
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: "User Name", // You can pass actual user details here
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#38bdf8"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing the payment.");
      setProcessing(false);
    }
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
              <div className="bg-muted/50 p-6 rounded-xl flex flex-col items-center justify-center border border-border/50">
                <span className="text-sm font-medium text-muted-foreground mb-1">Total Amount Due</span>
                <span className="text-4xl font-bold">₹{amount}</span>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handlePay}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-2" 
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting to Razorpay...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" /> Pay Securely
                    </>
                  )}
                </Button>
                
                <div className="flex flex-col items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-green-500" /> 100% Secure Payments by Razorpay
                  </div>
                  <div className="flex gap-2 opacity-60">
                    <span>UPI</span> • <span>Cards</span> • <span>NetBanking</span> • <span>Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
