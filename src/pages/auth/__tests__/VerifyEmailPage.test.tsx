import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { VerifyEmailPage } from '../VerifyEmailPage';
import { useAuth } from '@/contexts/AuthContext';
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

describe('VerifyEmailPage', () => {
  const mockResendVerification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      resendVerification: mockResendVerification,
      signIn: vi.fn(),
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
  });

  const renderComponent = (initialPath = '/verify-email?email=test%40example.com') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/signup" element={<div data-testid="signup-page">Signup Page</div>} />
          <Route path="/contact" element={<div data-testid="contact-page">Contact Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders check your email title and target email when valid email in URL', () => {
    renderComponent('/verify-email?email=candidate%40example.com');

    expect(screen.getByRole('heading', { name: /check your email/i })).toBeDefined();
    expect(screen.getByText('candidate@example.com')).toBeDefined();
    expect(
      screen.getByRole('button', { name: /resend verification email/i })
    ).toBeDefined();
  });

  it('renders email input form when NO valid email query parameter is present', () => {
    renderComponent('/verify-email');

    expect(
      screen.getByText(/enter your email address to receive a new verification link/i)
    ).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    const input = screen.getByRole('textbox', { name: /email address/i });
    expect(input).toBeDefined();
    expect(input.getAttribute('autocomplete')).toBe('email');
    expect(input.getAttribute('inputmode')).toBe('email');
    expect(screen.getByRole('button', { name: /send verification email/i })).toBeDefined();
    // Does NOT show "Sign Up Again"
    expect(screen.queryByRole('button', { name: /sign up again/i })).toBeNull();
  });

  it('rejects invalid email with an inline error and makes no network call', async () => {
    renderComponent('/verify-email');

    const input = screen.getByLabelText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(input, { target: { value: 'notanemail' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeDefined();
      expect(mockResendVerification).not.toHaveBeenCalled();
    });
  });

  it('valid email calls resendVerification once, displays neutral message, and typed email is never put into URL', async () => {
    mockResendVerification.mockResolvedValue({ error: null });
    renderComponent('/verify-email');

    const input = screen.getByLabelText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(input, { target: { value: '  Student@Example.COM  ' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Trimmed and lowercased
      expect(mockResendVerification).toHaveBeenCalledTimes(1);
      expect(mockResendVerification).toHaveBeenCalledWith('student@example.com', '/dashboard');
      expect(toast.success).toHaveBeenCalledWith(
        "If an unverified account exists for this email, we've sent a new link. If you've already verified, please log in."
      );
    });

    // Typed email is not in window.location.search
    expect(window.location.search).not.toContain('student@example.com');
  });

  it('shows identical neutral message on non-rate-limit error (never revealing account existence)', async () => {
    mockResendVerification.mockResolvedValue({
      error: new Error('User not found or unconfirmed'),
    });
    renderComponent('/verify-email');

    const input = screen.getByLabelText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(input, { target: { value: 'unknown@example.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "If an unverified account exists for this email, we've sent a new link. If you've already verified, please log in."
      );
    });
  });

  it('shows wait message on 429 rate limit error', async () => {
    const rateLimitError = new Error('rate limit') as Error & { status?: number; code?: string };
    rateLimitError.status = 429;
    rateLimitError.code = 'over_email_send_rate_limit';
    mockResendVerification.mockResolvedValue({ error: rateLimitError });

    renderComponent('/verify-email');

    const input = screen.getByLabelText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(input, { target: { value: 'ratelimited@example.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please wait a minute before trying again.');
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  it('disables button during 60-second cooldown using fake timers and prevents double click', async () => {
    vi.useFakeTimers();
    try {
      mockResendVerification.mockResolvedValue({ error: null });
      renderComponent('/verify-email');

      const input = screen.getByLabelText(/email address/i);
      const submitBtn = screen.getByRole('button', { name: /send verification email/i });

      fireEvent.change(input, { target: { value: 'student@example.com' } });

      // Double click
      fireEvent.click(submitBtn);
      fireEvent.click(submitBtn);

      await act(async () => {
        await Promise.resolve();
      });

      expect(mockResendVerification).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: /resend in 60s/i })).toBeDisabled();

      // Advance by 30 seconds
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      expect(screen.getByRole('button', { name: /resend in 30s/i })).toBeDisabled();

      // Advance past 60 seconds
      act(() => {
        vi.advanceTimersByTime(31000);
      });
      expect(screen.getByRole('button', { name: /send verification email/i })).not.toBeDisabled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders ResendHelp block with links to /login and /contact', () => {
    renderComponent('/verify-email?email=candidate%40example.com&returnTo=%2Finternships');

    expect(
      screen.getByText(/didn't get the email\? check your spam folder\./i)
    ).toBeDefined();

    const loginLinks = screen.getAllByRole('link', { name: /log in/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    const helpLoginLink = loginLinks.find(
      (link) => link.getAttribute('href') === '/login?returnTo=%2Finternships'
    );
    expect(helpLoginLink).toBeDefined();

    const contactLink = screen.getByRole('link', { name: /contact support/i });
    expect(contactLink).toBeDefined();
    expect(contactLink.getAttribute('href')).toBe('/contact');
  });
});
