import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeReturnTo, appUrl } from '@/lib/returnTo';
import type { Database } from '@/integrations/supabase/types';

export type AppRole = Database['public']['Enums']['app_role'];

export type UserRoleType =
  | 'admin'
  | 'employer'
  | 'student'
  | 'freelancer'
  | 'patient'
  | 'doctor'
  | 'project_owner';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string | null;
  qualification: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  user_type?: string | null;
}

export type StudentProfile =
  Database['public']['Tables']['student_profiles']['Row'];

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isEmployer: boolean;
  roles: AppRole[];
  userRole: string | null; // Keeps frontend check flexible
  profile: UserProfile | null;
  studentProfile: StudentProfile | null;
  authError: boolean; // Additive: true when role loading fails after retry
  retryAuth: () => Promise<void>; // Additive: re-attempts loading auth state
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    mobile?: string,
    roleOrReturnTo?: string,
    returnToParam?: string
  ) => Promise<{ error: Error | null; alreadyRegistered?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: (options?: { onSignedOut?: () => void }) => Promise<void>;
  signOutEverywhere: (options?: { onSignedOut?: () => void }) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  resendVerification: (
    email: string,
    returnTo?: string
  ) => Promise<{ error: Error | null }>;
}

function normalizeMobile(mobile?: string | null): string | undefined {
  if (!mobile) return undefined;
  const trimmed = mobile.trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  return digits ? `+${digits}` : undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [authError, setAuthError] = useState(false);

  const queryClient = useQueryClient();
  const currentRequestIdRef = useRef<number>(0);
  const currentUserIdRef = useRef<string | null>(null);
  const initialAuthResolvedRef = useRef<boolean>(false);
  const authEventReceivedRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const ensuredSessionsRef = useRef<Set<string>>(new Set());
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noEventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUserData = (onSignedOut?: () => void) => {
    try {
      queryClient.clear();
    } catch (err) {
      console.error('Error clearing query client cache:', err);
    }

    try {
      localStorage.removeItem('pendingApplication');
    } catch (err) {
      console.error('Error removing pendingApplication from localStorage:', err);
    }

    currentUserIdRef.current = null;
    setUser(null);
    setSession(null);
    setRoles([]);
    setUserRole(null);
    setIsAdmin(false);
    setIsStudent(false);
    setIsEmployer(false);
    setProfile(null);
    setStudentProfile(null);
    setAuthError(false);

    onSignedOut?.();
  };

  const loadUserData = async (
    targetUser: User,
    targetSession: Session,
    requestId: number
  ) => {
    const isNewUser = currentUserIdRef.current !== targetUser.id;
    if (isNewUser) {
      setLoading(true);
    }

    try {
      // 1. Fetch profile and user_roles in parallel
      const [profileRes, initialRolesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUser.id)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', targetUser.id),
      ]);

      let rolesRes = initialRolesRes;

      // Guard against race conditions and stale requests
      if (!mountedRef.current || currentRequestIdRef.current !== requestId) {
        return;
      }

      // Check for user_roles query error and retry once after 500ms
      if (rolesRes.error) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!mountedRef.current || currentRequestIdRef.current !== requestId) {
          return;
        }

        rolesRes = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', targetUser.id);
      }

      if (!mountedRef.current || currentRequestIdRef.current !== requestId) {
        return;
      }

      // If user_roles STILL failed after retry:
      if (rolesRes.error) {
        // Keep the user and session set, keep previously loaded roles for the same user,
        // and expose authError: true instead of wiping roles or treating user as having no roles.
        setUser(targetUser);
        setSession(targetSession);
        setAuthError(true);
        currentUserIdRef.current = targetUser.id;
        initialAuthResolvedRef.current = true;
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
          fetchTimeoutRef.current = null;
        }
        if (isNewUser) {
          setLoading(false);
        }
        return;
      }

      // Successful roles fetch: clear any prior authError
      setAuthError(false);

      const roleRows = rolesRes.data ?? [];
      const fetchedRoles = roleRows
        .map((r) => r.role as AppRole)
        .filter(
          (r): r is AppRole =>
            r === 'admin' || r === 'employer' || r === 'student'
        );

      const profileData =
        (profileRes.data as (UserProfile & { user_type?: string | null })) ??
        null;

      // 2. Derive userRole with strict priority: admin > employer > student
      // SECURITY: roles from user_metadata or profiles.user_type must NEVER grant 'admin' or 'employer'.
      let derivedRole: string | null = null;
      if (fetchedRoles.includes('admin')) {
        derivedRole = 'admin';
      } else if (fetchedRoles.includes('employer')) {
        derivedRole = 'employer';
      } else {
        // Fallback ONLY for legacy non-privileged dashboards
        const legacyCandidate =
          profileData?.user_type ||
          (typeof targetUser.user_metadata?.role === 'string'
            ? targetUser.user_metadata.role
            : undefined);

        const NON_PRIVILEGED_ROLES = [
          'freelancer',
          'patient',
          'doctor',
          'project_owner',
        ];

        if (legacyCandidate && NON_PRIVILEGED_ROLES.includes(legacyCandidate)) {
          derivedRole = legacyCandidate;
        } else if (fetchedRoles.includes('student')) {
          derivedRole = 'student';
        }
      }

      // 3. Handle student role: ensure_student_profile once per session, then load student_profiles
      let studentProfileData: StudentProfile | null = null;
      if (fetchedRoles.includes('student')) {
        if (!ensuredSessionsRef.current.has(targetUser.id)) {
          ensuredSessionsRef.current.add(targetUser.id);
          try {
            await (supabase.rpc as unknown as (fn: string) => Promise<unknown>)(
              'ensure_student_profile'
            );
          } catch {
            // fire-and-forget: catch and ignore errors
          }
        }

        const { data: studentData, error: studentError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', targetUser.id)
          .maybeSingle();

        if (!studentError && studentData) {
          studentProfileData = studentData;
        }
      }

      if (!mountedRef.current || currentRequestIdRef.current !== requestId) {
        return;
      }

      // 4. Update all state atomically - never expose half-loaded state
      currentUserIdRef.current = targetUser.id;
      initialAuthResolvedRef.current = true;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      setUser(targetUser);
      setSession(targetSession);
      setRoles(fetchedRoles);
      setUserRole(derivedRole);
      setIsAdmin(fetchedRoles.includes('admin'));
      setIsEmployer(fetchedRoles.includes('employer'));
      setIsStudent(fetchedRoles.includes('student'));
      setProfile(profileData);
      setStudentProfile(studentProfileData);
    } catch (err) {
      console.error('Error fetching user auth context:', err);
      setAuthError(true);
    } finally {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      if (mountedRef.current && currentRequestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const loadUserDataRef = useRef(loadUserData);
  loadUserDataRef.current = loadUserData;

  const clearUserDataRef = useRef(clearUserData);
  clearUserDataRef.current = clearUserData;

  useEffect(() => {
    mountedRef.current = true;

    // 3-second safety timeout: only ends loading if NO auth event at all was received
    noEventTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !authEventReceivedRef.current) {
        console.warn(
          'No auth event received after 3 seconds; ending initial loading state.'
        );
        initialAuthResolvedRef.current = true;
        setLoading(false);
      }
    }, 3000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mountedRef.current) return;
      authEventReceivedRef.current = true;
      if (noEventTimeoutRef.current) {
        clearTimeout(noEventTimeoutRef.current);
        noEventTimeoutRef.current = null;
      }

      if (event === 'TOKEN_REFRESHED') {
        // Keep existing user and roles, update session tokens only
        setSession(nextSession);
        if (nextSession?.user) {
          setUser(nextSession.user);
        }
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION'
      ) {
        if (nextSession?.user) {
          const isSameUser = currentUserIdRef.current === nextSession.user.id;
          if (!isSameUser) {
            setLoading(true);
            setUser(nextSession.user);
            setSession(nextSession);
          }

          // Allow up to 10 seconds total for this fetch; after that, set authError true and loading false
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
          }
          const nextRequestId = ++currentRequestIdRef.current;
          fetchTimeoutRef.current = setTimeout(() => {
            if (
              mountedRef.current &&
              currentRequestIdRef.current === nextRequestId
            ) {
              console.warn(
                'Auth data fetch timed out after 10 seconds; setting authError.'
              );
              setAuthError(true);
              setLoading(false);
            }
          }, 10000);

          setTimeout(() => {
            if (mountedRef.current) {
              loadUserDataRef.current(
                nextSession.user,
                nextSession,
                nextRequestId
              );
            }
          }, 0);
        } else {
          initialAuthResolvedRef.current = true;
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null;
          }
          currentRequestIdRef.current++;
          clearUserDataRef.current();
          setLoading(false);
        }
        return;
      }

      if (event === 'SIGNED_OUT' || !nextSession?.user) {
        initialAuthResolvedRef.current = true;
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
          fetchTimeoutRef.current = null;
        }
        currentRequestIdRef.current++;
        clearUserDataRef.current();
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      if (noEventTimeoutRef.current) {
        clearTimeout(noEventTimeoutRef.current);
        noEventTimeoutRef.current = null;
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      subscription.unsubscribe();
    };
  }, []);

  const retryAuth = async () => {
    if (user && session) {
      const nextRequestId = ++currentRequestIdRef.current;
      setLoading(true);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(() => {
        if (
          mountedRef.current &&
          currentRequestIdRef.current === nextRequestId
        ) {
          console.warn(
            'Auth data fetch timed out after 10 seconds; setting authError.'
          );
          setAuthError(true);
          setLoading(false);
        }
      }, 10000);
      await loadUserData(user, session, nextRequestId);
    }
  };

  const refreshProfile = async () => {
    if (user && session) {
      const nextRequestId = ++currentRequestIdRef.current;
      // Background silent refetch without setting loading = true
      await loadUserData(user, session, nextRequestId);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    mobile?: string,
    roleOrReturnTo?: string,
    returnToParam?: string
  ): Promise<{ error: Error | null; alreadyRegistered?: boolean }> => {
    try {
      let targetReturnTo = '/dashboard';
      if (returnToParam) {
        targetReturnTo = returnToParam;
      } else if (roleOrReturnTo && roleOrReturnTo.startsWith('/')) {
        targetReturnTo = roleOrReturnTo;
      }

      const safeReturnTo = sanitizeReturnTo(targetReturnTo, '/dashboard');
      const redirectUrl = appUrl(
        `/auth/callback?returnTo=${encodeURIComponent(safeReturnTo)}`
      );

      const userMetadata: Record<string, unknown> = {
        full_name: fullName?.trim() || '',
        signup_type: 'student',
      };

      const normalizedPhone = normalizeMobile(mobile);
      if (normalizedPhone) {
        userMetadata.mobile = normalizedPhone;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userMetadata,
        },
      });

      if (error) {
        const e = new Error(error.message) as Error & {
          code?: string;
          status?: number;
        };
        e.code = error.code;
        e.status = error.status;
        return { error: e, alreadyRegistered: false };
      }

      // Check for email enumeration protection where identities length is 0
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        return { error: null, alreadyRegistered: true };
      }

      return { error: null, alreadyRegistered: false };
    } catch (error) {
      return { error: error as Error, alreadyRegistered: false };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const e = new Error(error.message) as Error & {
          code?: string;
          status?: number;
        };
        e.code = error.code;
        e.status = error.status;
        return { error: e };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async (options?: { onSignedOut?: () => void }) => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      clearUserData(options?.onSignedOut);
      setLoading(false);
    }
  };

  const signOutEverywhere = async (options?: { onSignedOut?: () => void }) => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error('Error during signOutEverywhere:', err);
    } finally {
      clearUserData(options?.onSignedOut);
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: appUrl('/update-password'),
        }
      );
      if (error) {
        const e = new Error(error.message) as Error & {
          code?: string;
          status?: number;
        };
        e.code = error.code;
        e.status = error.status;
        return { error: e };
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (
    password: string
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resendVerification = async (
    email: string,
    returnTo?: string
  ): Promise<{ error: Error | null }> => {
    try {
      const safeReturnTo = sanitizeReturnTo(returnTo, '/dashboard');
      const emailRedirectTo = appUrl(
        `/auth/callback?returnTo=${encodeURIComponent(safeReturnTo)}`
      );

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        const e = new Error(error.message) as Error & {
          code?: string;
          status?: number;
        };
        e.code = error.code;
        e.status = error.status;
        return { error: e };
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        isStudent,
        isEmployer,
        roles,
        userRole,
        profile,
        studentProfile,
        authError,
        retryAuth,
        signUp,
        signIn,
        signOut,
        signOutEverywhere,
        refreshProfile,
        resetPassword,
        updatePassword,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}