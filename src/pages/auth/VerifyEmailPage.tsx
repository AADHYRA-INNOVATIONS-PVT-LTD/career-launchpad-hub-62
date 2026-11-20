import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { Mail, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeReturnTo } from '@/lib/returnTo';
import { ResendHelp } from './ResendHelp';

const NEUTRAL_RESEND_SUCCESS =
  "If an unverified account exists for this email, we've sent a new link. If you've already verified, please log in.";
const RATE_LIMIT_MESSAGE = 'Please wait a minute before trying again.';

function isRateLimitError(err: unknown): boolean {
  if (!err) return false;
  if (typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    const code = String(errorObj.code || '').toLowerCase();
    const status = errorObj.status;
    const msg = String(errorObj.message || '').toLowerCase();
    if (
      code === 'over_email_send_rate_limit' ||
      code === 'over_request_rate_limit' ||
      status === 429 ||
      msg.includes('rate limit') ||
      msg.includes('429')
    ) {
      return true;
    }
  }
  return false;
}

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawEmail = searchParams.get('email') || '';
  const rawReturnTo = searchParams.get('returnTo') || '/dashboard';
  const safeReturnTo = sanitizeReturnTo(rawReturnTo, '/dashboard');

  const { resendVerification } = useAuth();

  // Validate email param from URL
  const isValidEmail = z.string().email().safeParse(rawEmail.trim()).success;
  const verifiedEmail = isValidEmail ? rawEmail.trim() : null;

  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [typedEmail, setTypedEmail] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSend = async (targetEmail: string) => {
    if (cooldown > 0 || isSending) return;

    setIsSending(true);
    try {
      const { error } = await resendVerification(targetEmail, safeReturnTo);
      if (error && isRateLimitError(error)) {
        toast.error(RATE_LIMIT_MESSAGE);
      } else {
        toast.success(NEUTRAL_RESEND_SUCCESS);
        setCooldown(60);
      }
    } catch {
      toast.success(NEUTRAL_RESEND_SUCCESS);
      setCooldown(60);
    } finally {
      setIsSending(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0 || isSending) return;

    setInlineError(null);
    const cleaned = typedEmail.trim().toLowerCase();
    const result = z.string().email().safeParse(cleaned);

    if (!result.success) {
      setInlineError('Please enter a valid email address.');
      return;
    }

    await handleSend(result.data);
  };

  return (
    <AuthShell
      title="Check Your Email"
      subtitle="We've sent a confirmation link to activate your account"
      footer={
        <div className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
          <Link
            to={`/signup?returnTo=${encodeURIComponent(safeReturnTo)}`}
            className="hover:text-primary transition-colors inline-flex items-center justify-center gap-1 font-medium"
          >
            <ArrowLeft className="h-3 w-3" /> Use a different email
          </Link>
          <div>
            Already verified?{' '}
            <Link
              to={`/login?returnTo=${encodeURIComponent(safeReturnTo)}`}
              className="text-primary hover:underline font-medium"
            >
              Log in here
            </Link>
          </div>
        </div>
      }
    >
      <div className="text-center space-y-4 py-2">
        {/* Envelope Icon */}
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Mail className="h-7 w-7" />
        </div>

        {/* Dynamic / Generic Email Guidance */}
        <div className="space-y-2">
          {verifiedEmail ? (
            <p className="text-sm text-foreground">
              A verification email has been sent to{' '}
              <span className="font-semibold text-primary break-all">
                {verifiedEmail}
              </span>
              .
            </p>
          ) : (
            <p className="text-sm text-foreground">
              Enter your email address to receive a new verification link.
            </p>
          )}

          <div className="p-3 bg-muted/60 border border-border/80 rounded-xl text-xs text-muted-foreground text-left space-y-1">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              What to do next:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
              <li>Open your email provider and click the confirmation link.</li>
              <li>Be sure to check your spam or junk folder if not seen within a minute.</li>
              <li>The link is valid for a limited time. If it expires, request a new one.</li>
            </ul>
          </div>
        </div>

        {/* Resend Action */}
        <div className="pt-2">
          {verifiedEmail ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSend(verifiedEmail)}
              disabled={cooldown > 0 || isSending}
              className="w-full text-xs font-medium"
            >
              {isSending ? (
                <>
                  <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                `Resend email in ${cooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          ) : (
            <form onSubmit={handleManualSubmit} noValidate className="space-y-3 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="email-input">Email address</Label>
                <Input
                  id="email-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="student@example.com"
                  value={typedEmail}
                  onChange={(e) => {
                    setTypedEmail(e.target.value);
                    if (inlineError) setInlineError(null);
                  }}
                  disabled={isSending || cooldown > 0}
                  aria-invalid={!!inlineError}
                />
                {inlineError && (
                  <p className="text-xs text-destructive">{inlineError}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={cooldown > 0 || isSending}
                className="w-full text-xs font-medium"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  'Send verification email'
                )}
              </Button>
            </form>
          )}

          {/* Help Block */}
          <ResendHelp
            loginUrl={`/login?returnTo=${encodeURIComponent(safeReturnTo)}`}
            contactUrl="/contact"
          />
        </div>
      </div>
    </AuthShell>
  );
};

export default VerifyEmailPage;
