import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, GraduationCap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { AuthShell } from '@/components/auth/AuthShell';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeReturnTo } from '@/lib/returnTo';
import { loginSchema, LoginFormData } from '@/lib/authSchemas';
import { mapLoginError } from '@/lib/authErrors';
import { supabase } from '@/integrations/supabase/client';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect') || '/dashboard';
  const safeReturnTo = sanitizeReturnTo(rawReturnTo, '/dashboard');

  const { signIn, resendVerification } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [programTitle, setProgramTitle] = useState<string | null>(null);

  const mountedRef = useRef(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Track component unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Check for internship program banner
  useEffect(() => {
    let programSlug: string | null = null;
    try {
      const parsedUrl = new URL(safeReturnTo, 'https://example.com');
      if (parsedUrl.pathname === '/internships/apply') {
        programSlug = parsedUrl.searchParams.get('program');
      }
    } catch {
      // ignore parsing error
    }

    if (programSlug) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from('internship_programs')
            .select('title')
            .eq('slug', programSlug)
            .maybeSingle();

          if (mountedRef.current && !error && data?.title) {
            setProgramTitle(data.title);
          }
        } catch {
          // silently ignore banner failure
        }
      })();
    }
  }, [safeReturnTo]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (data: LoginFormData) => {
    if (lockoutSeconds > 0) return;
    setFormError(null);
    setIsUnconfirmed(false);

    try {
      const { error } = await signIn(data.email, data.password);

      if (!mountedRef.current) return;

      if (error) {
        if (import.meta.env.DEV) {
          const errObj = error as { code?: string; status?: number };
          console.warn('[login error]', errObj.code, errObj.status);
        }

        const mapped = mapLoginError(error);

        if (mapped.isEmailNotConfirmed) {
          setIsUnconfirmed(true);
          setUnconfirmedEmail(data.email);
        }

        setFormError(mapped.message);

        // Consecutive failure count for lockout
        const nextFailures = failureCount + 1;
        if (nextFailures >= 5) {
          setLockoutSeconds(30);
          setFailureCount(0);
        } else {
          setFailureCount(nextFailures);
        }
        return;
      }

      // Success: Reset failure count and show "Signing you in..."
      // Do NOT navigate manually — PublicOnlyRoute redirects once user auth state is resolved.
      setFailureCount(0);
      setIsSigningIn(true);
    } catch {
      if (mountedRef.current) {
        setFormError('Something went wrong. Please try again.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    const targetEmail = unconfirmedEmail || getValues('email');
    if (!targetEmail) return;

    try {
      const { error } = await resendVerification(targetEmail, safeReturnTo);
      if (!mountedRef.current) return;

      if (error) {
        toast.error('Failed to resend confirmation email. Please try again.');
      } else {
        toast.success(
          "If an unverified account exists for this email, we've sent a new link."
        );
        setResendCooldown(60);
      }
    } catch {
      toast.error('Failed to resend confirmation email.');
    }
  };

  const isFormLocked = lockoutSeconds > 0;
  const isPending = isSubmitting || isSigningIn;

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to access your student portal and applications"
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to={`/signup?returnTo=${encodeURIComponent(safeReturnTo)}`}
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      }
    >
      {/* Internship Application Context Banner */}
      {programTitle && (
        <div className="mb-5 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center gap-2.5 animate-in fade-in">
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
          <span>
            Sign in to continue your application for{' '}
            <strong className="font-semibold text-primary">{programTitle}</strong>
          </span>
        </div>
      )}

      {/* Signing in notification */}
      {isSigningIn && (
        <Alert className="mb-4 border-primary/30 bg-primary/5 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle className="text-sm font-semibold">Signing you in...</AlertTitle>
          <AlertDescription className="text-xs">
            Authenticating your session and preparing your dashboard.
          </AlertDescription>
        </Alert>
      )}

      {/* Lockout Alert */}
      {isFormLocked && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Temporarily Locked</AlertTitle>
          <AlertDescription className="text-xs">
            Too many consecutive failed login attempts. Please wait{' '}
            <strong className="font-bold">{lockoutSeconds} seconds</strong> before trying again.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {formError && !isFormLocked && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Sign In Failed</AlertTitle>
          <AlertDescription className="text-xs space-y-2">
            <p>{formError}</p>
            {isUnconfirmed && (
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="h-7 text-xs px-2.5 bg-background hover:bg-muted text-foreground border-border"
                >
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Resend Verification Email'}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="student@example.com"
            disabled={isPending || isFormLocked}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link
              to={`/forgot-password?returnTo=${encodeURIComponent(safeReturnTo)}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isPending || isFormLocked}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-2 font-medium"
          disabled={isPending || isFormLocked}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing you in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Permanent neutral verification recovery line */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Didn't get your verification email?{' '}
          <Link
            to={`/verify-email?returnTo=${encodeURIComponent(safeReturnTo)}`}
            className="text-primary hover:underline font-medium"
          >
            Resend it
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
