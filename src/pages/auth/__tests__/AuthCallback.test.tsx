import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthCallback } from '../AuthCallback';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

describe('AuthCallback', () => {
  const mockUser: User = {
    id: 'student-user-1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'student@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.history.pushState(null, '', '/');
  });

  const renderComponent = (initialPath = '/auth/callback') => {
    window.history.pushState(null, '', initialPath);
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
          <Route
            path="/dashboard/profile"
            element={<div data-testid="onboarding-page">Onboarding Profile Page</div>}
          />
          <Route path="/courses/it" element={<div data-testid="courses-page">Courses IT Page</div>} />
          <Route path="/update-password" element={<div data-testid="update-password-page">Update Password</div>} />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/verify-email" element={<div data-testid="verify-email-page">Verify Email</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders friendly expired link card when error is in query string', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback?error=access_denied&error_description=Link+expired');

    expect(screen.getByRole('heading', { name: /link expired/i })).toBeDefined();
    expect(
      screen.getByText(
        /this link has expired or was already used\. if you've already verified your email, log in below\. if not, request a new link\./i
      )
    ).toBeDefined();

    const loginBtn = screen.getByRole('button', { name: /^log in$/i });
    expect(loginBtn).toBeDefined();
    expect(loginBtn.className).toContain('bg-primary');

    const requestLinkBtn = screen.getByRole('button', {
      name: /request a new link/i,
    });
    expect(requestLinkBtn).toBeDefined();
    expect(requestLinkBtn.className).toContain('border-2');
  });

  it('renders friendly expired link card when error is in hash', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback#error=otp_expired&error_code=otp_expired');

    expect(screen.getByRole('heading', { name: /link expired/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /request a new link/i })).toBeDefined();
  });

  it('navigates student with incomplete profile to /dashboard/profile?onboarding=1', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: ['student'],
      isStudent: true,
      isAdmin: false,
      isEmployer: false,
      userRole: 'student',
      profile: null,
      studentProfile: {
        user_id: 'student-user-1',
        education_completed: false,
      } as unknown as ReturnType<typeof useAuth>['studentProfile'],
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback');
    expect(screen.getByTestId('onboarding-page')).toBeDefined();
  });

  it('navigates to explicit returnTo param even if student profile is incomplete', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: ['student'],
      isStudent: true,
      isAdmin: false,
      isEmployer: false,
      userRole: 'student',
      profile: null,
      studentProfile: {
        user_id: 'student-user-1',
        education_completed: false,
      } as unknown as ReturnType<typeof useAuth>['studentProfile'],
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback?returnTo=%2Fcourses%2Fit');
    expect(screen.getByTestId('courses-page')).toBeDefined();
  });

  it('ignores malicious returnTo and routes safely', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: ['student'],
      isStudent: true,
      isAdmin: false,
      isEmployer: false,
      userRole: 'student',
      profile: null,
      studentProfile: {
        user_id: 'student-user-1',
        education_completed: true,
      } as unknown as ReturnType<typeof useAuth>['studentProfile'],
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback?returnTo=https%3A%2F%2Fevil-attacker.com');
    // Must not go to external evil site, falls back to safe dashboard
    expect(screen.getByTestId('dashboard-page')).toBeDefined();
  });

  it('shows 10-second timeout card when auth does not resolve', () => {
    vi.useFakeTimers();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: true,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
      retryAuth: vi.fn(),
    });

    renderComponent('/auth/callback');

    // Initially shows loading state
    expect(screen.getByRole('heading', { name: /confirming authentication/i })).toBeDefined();

    // Advance timers by 10s
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Now renders timeout card
    expect(screen.getByRole('heading', { name: /verification timeout/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /retry confirmation/i })).toBeDefined();

    vi.useRealTimers();
  });
});
