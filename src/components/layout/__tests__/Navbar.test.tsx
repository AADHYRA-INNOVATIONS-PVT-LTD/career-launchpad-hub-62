import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '../Navbar';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        is: vi.fn().mockResolvedValue({ count: 3, error: null }),
      }),
    }),
  },
}));

describe('Navbar', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockUser: User = {
    id: 'user-456',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'student@aadhyra.com',
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('while loading: renders skeleton placeholders in button area and hides Login and user menu', () => {
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

    renderComponent();

    // In loading state, Login and Sign up buttons must not appear
    expect(screen.queryByRole('button', { name: /^login$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /sign up/i })).toBeNull();
    // User profile/initials must not appear
    expect(screen.queryByTitle(/notifications/i)).toBeNull();
  });

  it('logged out: shows ONLY Login and Sign up buttons, removes Apply Now, and hides user menu', () => {
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

    renderComponent();

    // Login and Sign up buttons visible
    const loginButtons = screen.getAllByRole('button', { name: /^login$/i });
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined();

    // Apply Now must NOT be visible when logged out
    expect(screen.queryByRole('link', { name: /apply now/i })).toBeNull();

    // User menu / bell must NOT be visible
    expect(screen.queryByTitle(/notifications/i)).toBeNull();

    // Also verify mobile menu when opened has Student Login, Employer Login, Sign up, and NO Apply Now
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(screen.queryByRole('link', { name: /apply now/i })).toBeNull();
    expect(screen.getByRole('link', { name: /student login/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /employer login/i })).toBeDefined();
    expect(screen.getAllByRole('button', { name: /sign up/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('logged in: hides Login and Sign up buttons, shows notification bell and user menu', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: ['student'],
      isStudent: true,
      isAdmin: false,
      isEmployer: false,
      userRole: 'student',
      profile: {
        id: 'p-1',
        user_id: 'user-456',
        full_name: 'Ananya Sharma',
        mobile: null,
        qualification: null,
        avatar_url: null,
        created_at: '',
        updated_at: '',
      },
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

    renderComponent();

    // Login and Sign up buttons must be HIDDEN
    expect(screen.queryByRole('button', { name: /^login$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /sign up/i })).toBeNull();

    // Bell and user display name visible
    expect(screen.getByTitle(/notifications/i)).toBeDefined();
    expect(screen.getByText('Ananya')).toBeDefined();

    // Apply Now link is present when logged in on desktop
    const applyLinks = screen.getAllByRole('link', { name: /apply now/i });
    expect(applyLinks.some((l) => l.getAttribute('href') === '/apply')).toBe(true);

    // Apply Now link is also present in mobile menu when opened
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const mobileApplyLinks = screen.getAllByRole('link', { name: /apply now/i });
    expect(mobileApplyLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('logged in as freelancer: routes Dashboard link to /freelancer-dashboard using userRole', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: 'freelancer',
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

    renderComponent();

    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('href')).toBe('/freelancer-dashboard');
  });

  it('logged in as patient: routes Dashboard link to /patient-dashboard using userRole', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: 'patient',
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

    renderComponent();

    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('href')).toBe('/patient-dashboard');
  });

  it('logged in as doctor: routes Dashboard link to /doctor-dashboard using userRole', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      roles: [],
      isStudent: false,
      isAdmin: false,
      isEmployer: false,
      userRole: 'doctor',
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

    renderComponent();

    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('href')).toBe('/doctor-dashboard');
  });

  it('logged in as student: routes Dashboard link to default /dashboard via getRoleHome', () => {
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

    renderComponent();

    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('href')).toBe('/dashboard');
  });
});
