import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message || "Failed to send reset email. Please try again.");
    } else {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-foreground text-lg leading-tight">
            Aadhyra Innovations
          </h2>
          <p className="text-xs text-primary font-medium tracking-wide">
            Password Recovery
          </p>
        </div>
      </div>

      <div className="bg-card border shadow-card rounded-2xl max-w-md w-full p-8 border-t-4 border-t-primary transition-all duration-300">
        {isSuccess ? (
          /* ── Success State ── */
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Check Your Email
            </h1>
            <p className="text-sm text-muted-foreground px-2">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Please check your inbox (and spam folder).
            </p>
            <p className="text-xs text-muted-foreground">
              The link will expire in 24 hours.
            </p>
            <div className="pt-2 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
              >
                Resend Email
              </Button>
              <Link to="/auth?role=student">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            <div className="text-center mb-6">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1.5 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-sm text-muted-foreground px-2">
                Enter your registered email address and we'll send you a link to
                reset your password.
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mb-5 animate-in fade-in zoom-in-95 duration-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Request Failed</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}

        {!isSuccess && (
          <div className="mt-6 text-center">
            <Link
              to="/auth?role=student"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
