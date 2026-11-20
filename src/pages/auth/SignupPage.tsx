import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';

import { AuthShell } from '@/components/auth/AuthShell';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeReturnTo } from '@/lib/returnTo';
import {
  signupSchema,
  SignupFormData,
  normalizeIndianMobile,
  passwordStrength,
} from '@/lib/authSchemas';
import { mapSignupError } from '@/lib/authErrors';
import { cn } from '@/lib/utils';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo') || searchParams.get('redirect') || '/dashboard';
  const safeReturnTo = sanitizeReturnTo(rawReturnTo, '/dashboard');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData & { website?: string }>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      website: '', // Honeypot field
    },
  });

  const watchedPassword = watch('password', '');
  const strength = passwordStrength(watchedPassword);

  const onSubmit = async (data: SignupFormData & { website?: string }) => {
    setFormError(null);

    // Honeypot check: If the hidden 'website' field was filled out, simulate success without calling API
    if (data.website && data.website.trim().length > 0) {
      navigate(
        `/verify-email?email=${encodeURIComponent(data.email)}&returnTo=${encodeURIComponent(safeReturnTo)}`
      );
      return;
    }

    const normalizedPhone = normalizeIndianMobile(data.mobile);
    if (!normalizedPhone) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      // SECURITY: NEVER pass any role to signUp.
      // roleOrReturnTo is passed as undefined, safeReturnTo is passed as returnToParam.
      const res = await signUp(
        data.email,
        data.password,
        data.fullName,
        normalizedPhone,
        undefined,
        safeReturnTo
      );

      if (res.error) {
        const mapped = mapSignupError(res.error);
        if (mapped.treatAsSuccess) {
          navigate(
            `/verify-email?email=${encodeURIComponent(data.email)}&returnTo=${encodeURIComponent(safeReturnTo)}`
          );
          return;
        }
        setFormError(mapped.message);
        return;
      }

      // If alreadyRegistered is true or error is null, navigate to verify-email without revealing registration status
      navigate(
        `/verify-email?email=${encodeURIComponent(data.email)}&returnTo=${encodeURIComponent(safeReturnTo)}`
      );
    } catch {
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthShell
      title="Create an Account"
      subtitle="Join Aadhyra to unlock student internships, courses, and certifications"
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to={`/login?returnTo=${encodeURIComponent(safeReturnTo)}`}
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      }
    >
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Sign Up Failed</AlertTitle>
          <AlertDescription className="text-xs">{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Hidden Honeypot field (hidden from view and screen readers) */}
        <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
          <label htmlFor="hp-website">Website</label>
          <input
            id="hp-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Aarav Sharma"
            autoComplete="name"
            disabled={isSubmitting}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="aarav@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <Label htmlFor="signup-mobile">Mobile Number (India)</Label>
          <Input
            id="signup-mobile"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel"
            disabled={isSubmitting}
            {...register('mobile')}
          />
          {errors.mobile && (
            <p className="text-xs text-destructive">{errors.mobile.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="signup-password">Password</Label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            disabled={isSubmitting}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}

          {/* Password Strength Meter */}
          {watchedPassword.length > 0 && (
            <div className="pt-1.5 space-y-1">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      'h-full flex-1 rounded-full transition-colors',
                      strength.score >= level
                        ? level === 1
                          ? 'bg-red-500'
                          : level === 2
                          ? 'bg-amber-500'
                          : level === 3
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                <span>Password strength:</span>
                <span
                  className={cn(
                    'font-medium',
                    strength.score === 1 && 'text-red-500',
                    strength.score === 2 && 'text-amber-500',
                    strength.score === 3 && 'text-blue-500',
                    strength.score === 4 && 'text-green-500'
                  )}
                >
                  {strength.hint}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <PasswordInput
            id="signup-confirm-password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            disabled={isSubmitting}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="pt-1">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="signup-terms"
              disabled={isSubmitting}
              onCheckedChange={(checked) =>
                setValue('acceptTerms', checked === true, {
                  shouldValidate: true,
                })
              }
            />
            <label
              htmlFor="signup-terms"
              className="text-xs text-muted-foreground leading-snug cursor-pointer select-none"
            >
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-destructive mt-1">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-3 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignupPage;
