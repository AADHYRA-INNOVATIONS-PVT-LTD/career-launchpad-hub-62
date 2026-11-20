import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdatePassword from '../../UpdatePassword';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('UpdatePassword', () => {
  const mockUpdatePassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: mockUpdatePassword,
      resendVerification: vi.fn(),
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

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
          id: 'sub-1',
          callback: vi.fn(),
        },
      },
    });

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          access_token: 'valid-token',
          refresh_token: 'refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'u-1',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
        },
      },
      error: null,
    });

    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/update-password']}>
        <Routes>
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route
            path="/login"
            element={<div data-testid="login-page">Login Page</div>}
          />
          <Route
            path="/forgot-password"
            element={<div data-testid="forgot-password-page">Forgot Password Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

  it('renders form inputs when recovery session is valid', async () => {
    renderComponent();

    expect(await screen.findByRole('heading', { name: /update password/i })).toBeDefined();
    expect(screen.getByLabelText(/^new password$/i)).toBeDefined();
    expect(screen.getByLabelText(/^confirm new password$/i)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /^update password$/i })
    ).toBeDefined();
  });

  it('validates passwordRule: shows inline error for short password', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'short1' } });
    fireEvent.change(confirmInput, { target: { value: 'short1' } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeDefined();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('validates passwordRule: shows inline error for password missing digits', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'LettersOnlyPassword' } });
    fireEvent.change(confirmInput, { target: { value: 'LettersOnlyPassword' } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/password must contain at least one digit/i)
    ).toBeDefined();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('validates passwordRule: shows inline error for password missing letters', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: '123456789' } });
    fireEvent.change(confirmInput, { target: { value: '123456789' } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/password must contain at least one letter/i)
    ).toBeDefined();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('shows inline error when confirmPassword does not match', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.change(confirmInput, { target: { value: 'MismatchPass456' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/passwords do not match/i)).toBeDefined();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('clears inline errors on user input', async () => {
    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'short1' } });
    fireEvent.change(confirmInput, { target: { value: 'short1' } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeDefined();

    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    expect(
      screen.queryByText(/password must be at least 8 characters/i)
    ).toBeNull();
  });

  it('submits valid matching password, signs out, and navigates to /login', async () => {
    mockUpdatePassword.mockResolvedValue({ error: null });

    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'NewSecurePassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewSecurePassword123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith('NewSecurePassword123');
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(screen.getByTestId('login-page')).toBeDefined();
    });
  });

  it('displays toast error when updatePassword service fails', async () => {
    mockUpdatePassword.mockResolvedValue({
      error: new Error('Token has expired or is invalid'),
    });

    renderComponent();

    await screen.findByRole('heading', { name: /update password/i });

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/^confirm new password$/i);
    const submitBtn = screen.getByRole('button', { name: /^update password$/i });

    fireEvent.change(passwordInput, { target: { value: 'NewSecurePassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewSecurePassword123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed to update password',
          description: 'Token has expired or is invalid',
          variant: 'destructive',
        })
      );
    });
  });
});
