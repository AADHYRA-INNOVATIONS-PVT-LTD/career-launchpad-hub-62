import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SignupPage } from '../SignupPage';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('SignupPage', () => {
  const mockSignUp = vi.fn();

  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      resendVerification: vi.fn(),
      signUp: mockSignUp,
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (initialPath = '/signup?returnTo=%2Fcourses') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/verify-email"
            element={<div data-testid="verify-email-page">Verify Email Page Mock</div>}
          />
          <Route path="/login" element={<div>Login Page Mock</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders all signup fields, password strength indicator, and terms checkbox', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /create an account/i })).toBeDefined();
    expect(screen.getByLabelText(/full name/i)).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByLabelText(/mobile number/i)).toBeDefined();
    expect(screen.getByLabelText(/^password/i)).toBeDefined();
    expect(screen.getByLabelText(/confirm password/i)).toBeDefined();
    expect(screen.getByLabelText(/i agree to the/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /create account/i })).toBeDefined();
  });

  it('calls signUp WITHOUT any role argument and with safeReturnTo, then navigates to /verify-email', async () => {
    mockSignUp.mockResolvedValue({ error: null, alreadyRegistered: false });

    renderComponent('/signup?returnTo=%2Finternships');

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Aarav Patel' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'aarav@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mobile number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'aarav@example.com',
        'ValidPass123',
        'Aarav Patel',
        '+919876543210',
        undefined, // NEVER send a role
        '/internships'
      );
      expect(screen.getByTestId('verify-email-page')).toBeDefined();
    });
  });

  it('honeypot field skips API call and navigates to verify-email directly', async () => {
    renderComponent();

    // Fill honeypot field
    const honeypot = screen.getByLabelText(/website/i);
    fireEvent.change(honeypot, { target: { value: 'https://spam-bot.com' } });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Bot User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'bot@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mobile number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled();
      expect(screen.getByTestId('verify-email-page')).toBeDefined();
    });
  });

  it('navigates to verify-email without revealing alreadyRegistered status', async () => {
    // Simulating email enumeration protection: user already exists, Supabase returns alreadyRegistered: true
    mockSignUp.mockResolvedValue({ error: null, alreadyRegistered: true });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Existing User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mobile number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByTestId('verify-email-page')).toBeDefined();
    });
  });

  it('maps rate limit error to a friendly message', async () => {
    mockSignUp.mockResolvedValue({
      error: new Error('over_email_send_rate_limit: too many requests'),
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Rate User' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'rate@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mobile number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/too many attempts\. please wait a few minutes and try again\./i)
      ).toBeDefined();
    });
  });
});
