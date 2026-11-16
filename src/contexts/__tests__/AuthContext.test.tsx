import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User, Session, AuthChangeEvent, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      auth: {
        onAuthStateChange: vi.fn(),
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        resend: vi.fn(),
      },
      from: vi.fn(),
      rpc: vi.fn(),
    },
  };
});

describe('AuthContext', () => {
  let authCallback: ((event: AuthChangeEvent, session: Session | null) => void) | null = null;
  let mockUnsubscribe: ReturnType<typeof vi.fn>;

  const mockUser: User = {
    id: 'user-123',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'student@example.com',
  };

  const mockSession: Session = {
    access_token: 'fake-token-123',
    refresh_token: 'fake-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUnsubscribe = vi.fn();
    authCallback = null;

    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
            id: 'mock-sub-id',
            callback: cb,
          },
        },
      };
    });

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    } as unknown as Awaited<ReturnType<typeof supabase.rpc>>);

    // Default supabase.from mock handlers
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: 'p1',
                  user_id: 'user-123',
                  full_name: 'Test Student',
                  mobile: '+919876543210',
                  qualification: null,
                  avatar_url: null,
                  created_at: '2026-01-01',
                  updated_at: '2026-01-01',
                },
                error: null,
              }),
            }),
          }),
        } as unknown as ReturnType<typeof supabase.from>;
      }
      if (table === 'user_roles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ role: 'student' }],
              error: null,
            }),
          }),
        } as unknown as ReturnType<typeof supabase.from>;
      }
      if (table === 'student_profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  user_id: 'user-123',
                  student_code: 'STD-101',
                  college: 'University of Testing',
                  degree: 'B.Tech',
                  branch: 'Computer Science',
                  academic_year: 4,
                  graduation_year: 2026,
                  skills: ['React', 'TypeScript'],
                  resume_path: null,
                  education_completed: false,
                  created_at: '2026-01-01',
                  updated_at: '2026-01-01',
                },
                error: null,
              }),
            }),
          }),
        } as unknown as ReturnType<typeof supabase.from>;
      }
      return {} as unknown as ReturnType<typeof supabase.from>;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('no session on INITIAL_SESSION: loading false, user null', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);

    act(() => {
      authCallback?.('INITIAL_SESSION', null);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.roles).toEqual([]);
    expect(result.current.isStudent).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.authError).toBe(false);
  });

  it('session + roles [student]: roles, isStudent true, loading false only after data arrives (never user-set with roles empty and loading false)', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    // In no observable state should user be set while roles is empty and loading is false
    if (!result.current.loading && result.current.user) {
      expect(result.current.roles.length).toBeGreaterThan(0);
    }

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.roles).toEqual(['student']);
    expect(result.current.isStudent).toBe(true);
    expect(result.current.isEmployer).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.userRole).toBe('student');
    expect(result.current.studentProfile?.student_code).toBe('STD-101');
    expect(result.current.authError).toBe(false);
  });

  it('roles query error: authError true, user still set, roles not wiped', async () => {
    // 1. Initial successful resolution
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.roles).toEqual(['student']);
    });

    // 2. Now mock user_roles failure on retry
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'user_roles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('PostgreSQL connection timeout'),
            }),
          }),
        } as unknown as ReturnType<typeof supabase.from>;
      }
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        } as unknown as ReturnType<typeof supabase.from>;
      }
      return {} as unknown as ReturnType<typeof supabase.from>;
    });

    // Call retryAuth
    await act(async () => {
      await result.current.retryAuth();
    });

    await waitFor(() => {
      expect(result.current.authError).toBe(true);
    });

    // User and session remain set, and previous roles are NOT wiped
    expect(result.current.user?.id).toBe('user-123');
    expect(result.current.session).toBeDefined();
    expect(result.current.roles).toEqual(['student']);
  });

  it('SIGNED_IN for the same user does NOT set loading true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Emit SIGNED_IN for the same user ID
    act(() => {
      authCallback?.('SIGNED_IN', { ...mockSession });
    });

    // loading must remain false
    expect(result.current.loading).toBe(false);
    expect(result.current.user?.id).toBe('user-123');
  });

  it('refreshProfile() does NOT set loading true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loadingDuringRefresh = false;
    await act(async () => {
      const refreshPromise = result.current.refreshProfile();
      loadingDuringRefresh = result.current.loading;
      await refreshPromise;
    });

    expect(loadingDuringRefresh).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('signUp never includes admin/employer/student as a role; identities empty returns alreadyRegistered true and no error', async () => {
    let capturedSignUpOptions: SignUpWithPasswordCredentials | null = null;

    vi.mocked(supabase.auth.signUp).mockImplementation(async (credentials) => {
      capturedSignUpOptions = credentials;
      return {
        data: {
          user: {
            id: 'registered-user',
            identities: [], // Empty identities array simulates already registered email
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
          session: null,
        },
        error: null,
      };
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    let signUpResult: { error: Error | null; alreadyRegistered?: boolean } = {
      error: null,
    };

    await act(async () => {
      signUpResult = await result.current.signUp(
        'existing@example.com',
        'Password123!',
        'Existing Student',
        '9876543210',
        'admin' // Attempting to pass privileged role
      );
    });

    // Verified options sent to supabase.auth.signUp
    expect(capturedSignUpOptions).toBeDefined();
    const meta = (capturedSignUpOptions as unknown as { options: { data: Record<string, unknown> } }).options.data;
    expect(meta.full_name).toBe('Existing Student');
    expect(meta.signup_type).toBe('student');
    expect(meta.mobile).toBe('+919876543210');

    // Crucial check: role is NEVER sent in user metadata
    expect(meta.role).toBeUndefined();
    expect(meta.roles).toBeUndefined();

    // Already registered email returned without enumeration error
    expect(signUpResult.error).toBeNull();
    expect(signUpResult.alreadyRegistered).toBe(true);
  });

  it('signOut clears state', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeDefined();
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.roles).toEqual([]);
    expect(result.current.userRole).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.studentProfile).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isStudent).toBe(false);
    expect(result.current.isEmployer).toBe(false);
    expect(result.current.authError).toBe(false);
  });

  it('sign out then sign in as the SAME user: loading becomes true again until data arrives (no moment with user null and loading false after SIGNED_IN)', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      authCallback?.('INITIAL_SESSION', mockSession);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user?.id).toBe('user-123');
    });

    // 1. Sign out
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);

    // 2. Sign in as the SAME user
    act(() => {
      authCallback?.('SIGNED_IN', mockSession);
    });

    // Immediately after SIGNED_IN: loading is true, user is set, no moment with user null and loading false
    expect(result.current.loading).toBe(true);
    expect(result.current.user).not.toBeNull();

    // 3. Wait until data arrives and loading becomes false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user?.id).toBe('user-123');
    expect(result.current.roles).toEqual(['student']);
  });

  it('a slow roles fetch (simulate 4 seconds with fake timers) does NOT cause loading false with user null', async () => {
    vi.useFakeTimers();

    try {
      // Mock user_roles to take 4000ms
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockImplementation(
                () =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve({
                        data: [{ role: 'student' }],
                        error: null,
                      });
                    }, 4000);
                  })
              ),
            }),
          } as unknown as ReturnType<typeof supabase.from>;
        }
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: {
                    id: 'p1',
                    user_id: 'user-123',
                    full_name: 'Test Student',
                    mobile: null,
                    qualification: null,
                    avatar_url: null,
                    created_at: '2026-01-01',
                    updated_at: '2026-01-01',
                  },
                  error: null,
                }),
              }),
            }),
          } as unknown as ReturnType<typeof supabase.from>;
        }
        if (table === 'student_profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          } as unknown as ReturnType<typeof supabase.from>;
        }
        return {} as unknown as ReturnType<typeof supabase.from>;
      });

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      act(() => {
        authCallback?.('INITIAL_SESSION', mockSession);
      });

      // At t = 0: loading should be true
      expect(result.current.loading).toBe(true);

      // Advance timers past the 3-second safety timeout (e.g. to 3500ms)
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // The 3-second safety timeout must NOT set loading false with user null because auth event was received
      expect(result.current.loading).toBe(true);
      expect(result.current.user).not.toBeNull();

      // Advance timers past 4000ms to allow the slow query to resolve
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.user?.id).toBe('user-123');
      expect(result.current.roles).toEqual(['student']);
    } finally {
      vi.useRealTimers();
    }
  });
});
