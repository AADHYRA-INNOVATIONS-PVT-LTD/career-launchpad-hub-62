import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('LoginPage', () => {
  const mockSignIn = vi.fn();
  const mockResendVerification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: mockSignIn,
      resendVerification: mockResendVerification,
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      retryAuth: vi.fn(),
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { title: 'Full Stack Web Development Internship' },
            error: null,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof supabase.from>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (initialPath = '/login') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<div>Signup Page Mock</div>} />
          <Route path="/forgot-password" element={<div>Forgot Password Mock</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders login form and links to signup and forgot password', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByLabelText(/^password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /forgot password\?/i })).toBeDefined();
  });

  it('displays validation errors on invalid input', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeDefined();
    });
  });

  it('submits valid form and displays "Signing you in..." on success without manual navigation', async () => {
    mockSignIn.mockResolvedValue({ error: null });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'student@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'ValidPassword123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('student@example.com', 'ValidPassword123!');
      expect(screen.getAllByText(/signing you in\.\.\./i).length).toBeGreaterThan(0);
    });
  });

  it('maps "Invalid login credentials" to a user-friendly error', async () => {
    mockSignIn.mockResolvedValue({
      error: new Error('Invalid login credentials'),
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'WrongPassword!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Incorrect email or password.')).toBeDefined();
    });
  });

  it('maps "Email not confirmed" and displays a working resend verification button with 60s cooldown', async () => {
    mockSignIn.mockResolvedValue({
      error: new Error('Email not confirmed'),
    });
    mockResendVerification.mockResolvedValue({ error: null });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'unconfirmed@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/please verify your email before logging in/i)).toBeDefined();
    });

    const resendBtn = screen.getByRole('button', { name: /resend verification email/i });
    expect(resendBtn).toBeDefined();

    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(mockResendVerification).toHaveBeenCalledWith('unconfirmed@example.com', '/dashboard');
      expect(toast.success).toHaveBeenCalledWith(
        "If an unverified account exists for this email, we've sent a new link."
      );
      expect(screen.getByText(/resend available in 60s/i)).toBeDefined();
    });
  });

  it('neutral "Didn\'t get your verification email? Resend it" link is always present and points to /verify-email with safe returnTo', () => {
    renderComponent('/login?returnTo=%2Fcourses');

    const resendLink = screen.getByRole('link', { name: /resend it/i });
    expect(resendLink).toBeDefined();
    expect(resendLink.getAttribute('href')).toBe('/verify-email?returnTo=%2Fcourses');
  });

  it('wrong password shows generic message and does NOT show the inline Resend button', async () => {
    mockSignIn.mockResolvedValue({
      error: new Error('Invalid login credentials'),
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'WrongPassword!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Incorrect email or password.')).toBeDefined();
    });

    // The inline Resend Verification Email button must NOT be present
    expect(screen.queryByRole('button', { name: /resend verification email/i })).toBeNull();
  });

  it('disables the form for 30 seconds after 5 consecutive failures', async () => {
    mockSignIn.mockResolvedValue({
      error: new Error('Invalid login credentials'),
    });

    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'student@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledTimes(i + 1);
      });
    }

    await waitFor(() => {
      expect(screen.getByText(/temporarily locked/i)).toBeDefined();
      expect(screen.getByText(/too many consecutive failed login attempts/i)).toBeDefined();
      expect(submitBtn.hasAttribute('disabled')).toBe(true);
    });
  });

  it('shows application banner when returnTo matches internship program slug', async () => {
    renderComponent('/login?returnTo=%2Finternships%2Fapply%3Fprogram%3Dfull-stack');

    await waitFor(() => {
      expect(screen.getByText(/full stack web development internship/i)).toBeDefined();
    });
  });
});
