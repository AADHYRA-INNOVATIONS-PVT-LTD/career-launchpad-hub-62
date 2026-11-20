import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeReturnTo, getRoleHome } from '@/lib/returnTo';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, roles, isStudent, studentProfile } = useAuth();

  const [timedOut, setTimedOut] = useState(false);

  // Extract query and hash params BEFORE anything else
  const { authError, returnToParam } = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash
    );

    const error = searchParams.get('error') || hashParams.get('error');
    const errorCode =
      searchParams.get('error_code') || hashParams.get('error_code');
    const errorDesc =
      searchParams.get('error_description') ||
      hashParams.get('error_description');

    const retParam =
      searchParams.get('returnTo') || hashParams.get('returnTo') || null;
    const emailParam =
      searchParams.get('email') || hashParams.get('email') || null;

    let detectedError: string | null = null;
    if (error || errorCode || errorDesc) {
      detectedError =
        errorDesc ||
        error ||
        errorCode ||
        'This authentication link is invalid or has expired.';
    }

    return {
      authError: detectedError,
      returnToParam: retParam,
      emailParam,
    };
  }, []);

  // Subscribe to PASSWORD_RECOVERY in this page
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // 10-second timeout guard
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // When user is resolved
  useEffect(() => {
    if (authError || loading || !user) return;

    const safeReturnTo = returnToParam
      ? sanitizeReturnTo(returnToParam, '')
      : '';

    // 1. Explicit returnTo that is not the plain default /dashboard
    if (safeReturnTo && safeReturnTo !== '/dashboard') {
      navigate(safeReturnTo, { replace: true });
      return;
    }

    // 2. Student onboarding check
    const isStudentUser = roles.includes('student') || isStudent;
    if (
      isStudentUser &&
      studentProfile &&
      studentProfile.education_completed === false
    ) {
      navigate('/dashboard/profile?onboarding=1', { replace: true });
      return;
    }

    // 3. Role-based home
    navigate(getRoleHome(roles), { replace: true });
  }, [
    authError,
    loading,
    user,
    roles,
    isStudent,
    studentProfile,
    returnToParam,
    navigate,
  ]);

  // 1. Show error card if error was found in query string or hash
  if (authError) {
    return (
      <AuthShell
        title="Link Expired"
        subtitle="We were unable to verify your link"
        footer={
          <div className="text-center text-xs text-muted-foreground">
            Need help?{' '}
            <Link to="/contact" className="text-primary hover:underline font-medium">
              Contact Support
            </Link>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">
              Invalid or Expired Link
            </AlertTitle>
            <AlertDescription className="text-xs mt-1">
              This link has expired or was already used. If you've already verified your
              email, log in below. If not, request a new link.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to={
                returnToParam
                  ? `/login?returnTo=${encodeURIComponent(sanitizeReturnTo(returnToParam, ''))}`
                  : '/login'
              }
            >
              <Button className="w-full text-xs font-medium">
                Log in
              </Button>
            </Link>
            <Link
              to={
                returnToParam
                  ? `/verify-email?returnTo=${encodeURIComponent(sanitizeReturnTo(returnToParam, ''))}`
                  : '/verify-email'
              }
            >
              <Button variant="outline" className="w-full text-xs font-medium">
                Request a new link
              </Button>
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  // 2. Show 10-second timeout card if session failed to resolve
  if (timedOut && !user) {
    return (
      <AuthShell
        title="Verification Timeout"
        subtitle="Authentication confirmation is taking longer than expected"
        footer={
          <div className="text-center text-xs text-muted-foreground">
            Experiencing difficulties?{' '}
            <Link to="/contact" className="text-primary hover:underline font-medium">
              Contact Support
            </Link>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">
              Connection Delayed
            </AlertTitle>
            <AlertDescription className="text-xs mt-1">
              We couldn't confirm your link within 10 seconds. You can reload this page
              to try again or return to the login page.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full text-xs font-medium inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Confirmation
            </Button>
            <Link to="/login">
              <Button variant="outline" className="w-full text-xs font-medium">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  // 3. Default loading state while Supabase client authenticates session
  return (
    <AuthShell
      title="Confirming Authentication"
      subtitle="Please wait while we verify your credentials..."
    >
      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground animate-pulse">
          Setting up your session and redirecting you to your destination...
        </p>
      </div>
    </AuthShell>
  );
};

export default AuthCallback;
