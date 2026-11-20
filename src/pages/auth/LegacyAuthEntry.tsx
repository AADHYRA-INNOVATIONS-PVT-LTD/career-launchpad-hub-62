import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import { sanitizeReturnTo } from '@/lib/returnTo';

/**
 * LegacyAuthEntry (mounted at /auth in App.tsx):
 * - If ?role= is absent, "student", or "candidate":
 *   Redirects (<Navigate replace>) to /login preserving returnTo/redirect (sanitized into returnTo).
 * - Any other role renders the existing AuthPage unchanged.
 */
export const LegacyAuthEntry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  if (!role || role === 'student' || role === 'candidate') {
    const rawTarget =
      searchParams.get('returnTo') || searchParams.get('redirect') || '';
    const safeTarget = sanitizeReturnTo(rawTarget, '');
    const to = safeTarget
      ? `/login?returnTo=${encodeURIComponent(safeTarget)}`
      : '/login';

    return <Navigate to={to} replace />;
  }

  return <AuthPage />;
};

export default LegacyAuthEntry;
