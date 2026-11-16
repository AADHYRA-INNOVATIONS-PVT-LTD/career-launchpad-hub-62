import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';
import { ProtectedRoute } from '../ProtectedRoute';
import { PublicOnlyRoute } from '../PublicOnlyRoute';
import * as AuthContextModule from '@/contexts/AuthContext';

// Mock useAuth
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof AuthContextModule>(
    '@/contexts/AuthContext'
  );
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockedUseAuth = vi.mocked(AuthContextModule.useAuth);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton and does not redirect while loading is true', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: true,
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div data-testid="dashboard-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('auth-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders error recovery card when authError is true, calling retryAuth on click', () => {
    const retryAuthMock = vi.fn();
    mockedUseAuth.mockReturnValue({
      user: { id: 'user-1' } as unknown as User,
      session: { user: { id: 'user-1' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: true,
      retryAuth: retryAuthMock,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('auth-error-card')).toBeInTheDocument();
    expect(screen.getByText("We couldn't load your account")).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    expect(retryAuthMock).toHaveBeenCalledTimes(1);
  });

  it('redirects signed-out visitor to /login with encoded returnTo query', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter
        initialEntries={['/dashboard/applications?tab=active#review']}
      >
        <Routes>
          <Route
            path="/dashboard/applications"
            element={
              <ProtectedRoute>
                <div>Dashboard Applications</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<div data-testid="login-page">Login Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Applications')).not.toBeInTheDocument();
  });

  it('allows access to student user when protected route requires student role', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'student-123', email: 'student@example.com' } as unknown as User,
      session: { user: { id: 'student-123' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: true,
      isEmployer: false,
      roles: ['student'],
      userRole: 'student',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/internships/apply']}>
        <Routes>
          <Route
            path="/internships/apply"
            element={
              <ProtectedRoute roles={['student']}>
                <div data-testid="student-portal">Internship Apply Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('student-portal')).toBeInTheDocument();
    expect(screen.getByText('Internship Apply Page')).toBeInTheDocument();
  });

  it('allows access to admin user when protected route requires admin role', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'admin-456', email: 'admin@example.com' } as unknown as User,
      session: { user: { id: 'admin-456' } } as unknown as Session,
      loading: false,
      isAdmin: true,
      isStudent: false,
      isEmployer: false,
      roles: ['admin'],
      userRole: 'admin',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin/students']}>
        <Routes>
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute roles={['admin']}>
                <div data-testid="admin-panel">Admin Students View</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
    expect(screen.getByText('Admin Students View')).toBeInTheDocument();
  });

  it('renders 403 Access Denied page when authenticated user lacks the required role', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'student-123', email: 'student@example.com' } as unknown as User,
      session: { user: { id: 'student-123' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: true,
      isEmployer: false,
      roles: ['student'],
      userRole: 'student',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('access-denied')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/Required role: admin/)).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

  it('supports nested route Outlet usage', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'student-123' } as unknown as User,
      session: { user: { id: 'student-123' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: true,
      isEmployer: false,
      roles: ['student'],
      userRole: 'student',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/courses']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard/courses"
              element={<div data-testid="nested-content">Nested Outlet Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });
});

describe('PublicOnlyRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton while loading is true', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: true,
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>Login Form</div>
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('auth-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Login Form')).not.toBeInTheDocument();
  });

  it('renders children for unauthenticated visitors', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      isStudent: false,
      isEmployer: false,
      roles: [],
      userRole: null,
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div data-testid="login-form">Login Form</div>
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('redirects signed-in user with malicious returnTo to role home (/dashboard for student)', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'student-123' } as unknown as User,
      session: { user: { id: 'student-123' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: true,
      isEmployer: false,
      roles: ['student'],
      userRole: 'student',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/login?returnTo=https://evil.com']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>Login Form</div>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={<div data-testid="student-home">Student Dashboard</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('student-home')).toBeInTheDocument();
    expect(screen.queryByText('Login Form')).not.toBeInTheDocument();
  });

  it('redirects signed-in admin with malicious returnTo to admin home (/admin)', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'admin-123' } as unknown as User,
      session: { user: { id: 'admin-123' } } as unknown as Session,
      loading: false,
      isAdmin: true,
      isStudent: false,
      isEmployer: false,
      roles: ['admin'],
      userRole: 'admin',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/login?returnTo=%2f%2fevil.com']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>Login Form</div>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/admin"
            element={<div data-testid="admin-home">Admin Dashboard</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('admin-home')).toBeInTheDocument();
  });

  it('redirects signed-in user with valid returnTo to that sanitized path', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'student-123' } as unknown as User,
      session: { user: { id: 'student-123' } } as unknown as Session,
      loading: false,
      isAdmin: false,
      isStudent: true,
      isEmployer: false,
      roles: ['student'],
      userRole: 'student',
      profile: null,
      studentProfile: null,
      authError: false,
      retryAuth: vi.fn(),
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signOutEverywhere: vi.fn(),
      refreshProfile: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      resendVerification: vi.fn(),
    });

    render(
      <MemoryRouter
        initialEntries={['/login?returnTo=%2Fcourses%2Ffull-stack-web']}
      >
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>Login Form</div>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/courses/full-stack-web"
            element={<div data-testid="course-page">Course Details Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('course-page')).toBeInTheDocument();
  });
});
