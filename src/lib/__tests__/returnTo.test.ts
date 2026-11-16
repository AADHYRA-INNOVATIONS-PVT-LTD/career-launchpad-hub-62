import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  sanitizeReturnTo,
  buildReturnTo,
  appUrl,
  getRoleHome,
} from '../returnTo';

describe('sanitizeReturnTo', () => {
  const fallback = '/dashboard';

  // Explicit required malicious & edge test cases
  it('rejects double slash protocol-relative URL: "//evil.com"', () => {
    expect(sanitizeReturnTo('//evil.com')).toBe(fallback);
  });

  it('rejects slash backslash open redirect: "/\\\\evil.com"', () => {
    expect(sanitizeReturnTo('/\\evil.com')).toBe(fallback);
  });

  it('rejects absolute URL: "https://evil.com"', () => {
    expect(sanitizeReturnTo('https://evil.com')).toBe(fallback);
  });

  it('rejects javascript pseudo-protocol: "javascript:alert(1)"', () => {
    expect(sanitizeReturnTo('javascript:alert(1)')).toBe(fallback);
  });

  it('rejects encoded double-slash: "%2f%2fevil.com"', () => {
    expect(sanitizeReturnTo('%2f%2fevil.com')).toBe(fallback);
  });

  it('rejects CRLF header injection attempts: "/dashboard%0d%0a"', () => {
    expect(sanitizeReturnTo('/dashboard%0d%0a')).toBe(fallback);
  });

  it('rejects disallowed auth page: "/login"', () => {
    expect(sanitizeReturnTo('/login')).toBe(fallback);
  });

  it('rejects disallowed auth page: "/signup"', () => {
    expect(sanitizeReturnTo('/signup')).toBe(fallback);
  });

  it('rejects disallowed auth page: "/verify-email"', () => {
    expect(sanitizeReturnTo('/verify-email')).toBe(fallback);
  });

  it('rejects disallowed auth page: "/auth/callback"', () => {
    expect(sanitizeReturnTo('/auth/callback')).toBe(fallback);
  });

  it('rejects empty string', () => {
    expect(sanitizeReturnTo('')).toBe(fallback);
  });

  it('rejects null input', () => {
    expect(sanitizeReturnTo(null)).toBe(fallback);
  });

  it('rejects undefined input', () => {
    expect(sanitizeReturnTo(undefined)).toBe(fallback);
  });

  // Valid route test cases
  it('allows valid "/dashboard/applications?x=1"', () => {
    expect(sanitizeReturnTo('/dashboard/applications?x=1')).toBe(
      '/dashboard/applications?x=1'
    );
  });

  it('allows valid "/internships/apply?program=ai-ml&months=3"', () => {
    expect(
      sanitizeReturnTo('/internships/apply?program=ai-ml&months=3')
    ).toBe('/internships/apply?program=ai-ml&months=3');
  });

  it('allows exact "/dashboard"', () => {
    expect(sanitizeReturnTo('/dashboard')).toBe('/dashboard');
  });

  it('allows exact "/courses"', () => {
    expect(sanitizeReturnTo('/courses')).toBe('/courses');
  });

  it('allows "/courses/full-stack-web-development"', () => {
    expect(sanitizeReturnTo('/courses/full-stack-web-development')).toBe(
      '/courses/full-stack-web-development'
    );
  });

  it('allows exact "/employer"', () => {
    expect(sanitizeReturnTo('/employer')).toBe('/employer');
  });

  it('allows "/employer/dashboard"', () => {
    expect(sanitizeReturnTo('/employer/dashboard')).toBe('/employer/dashboard');
  });

  it('allows exact "/admin"', () => {
    expect(sanitizeReturnTo('/admin')).toBe('/admin');
  });

  it('allows "/admin/students?sort=asc"', () => {
    expect(sanitizeReturnTo('/admin/students?sort=asc')).toBe(
      '/admin/students?sort=asc'
    );
  });

  it('allows "/career"', () => {
    expect(sanitizeReturnTo('/career')).toBe('/career');
  });

  it('allows "/apply?jobId=123"', () => {
    expect(sanitizeReturnTo('/apply?jobId=123')).toBe('/apply?jobId=123');
  });

  it('allows "/freelancer-dashboard"', () => {
    expect(sanitizeReturnTo('/freelancer-dashboard')).toBe('/freelancer-dashboard');
  });

  it('allows "/patient-dashboard/appointments"', () => {
    expect(sanitizeReturnTo('/patient-dashboard/appointments')).toBe(
      '/patient-dashboard/appointments'
    );
  });

  it('allows "/doctor-dashboard#today"', () => {
    expect(sanitizeReturnTo('/doctor-dashboard#today')).toBe(
      '/doctor-dashboard#today'
    );
  });

  // Additional security & edge cases
  it('rejects encoded backslash: "/dashboard%5cevil"', () => {
    expect(sanitizeReturnTo('/dashboard%5cevil')).toBe(fallback);
  });

  it('rejects data URI: "data:text/html,<script>alert(1)</script>"', () => {
    expect(sanitizeReturnTo('data:text/html,<script>alert(1)</script>')).toBe(
      fallback
    );
  });

  it('rejects embedded scheme with ://: "/dashboard?redirect=http://evil.com"', () => {
    expect(sanitizeReturnTo('/dashboard?redirect=http://evil.com')).toBe(
      fallback
    );
  });

  it('rejects whitespace in path: "/dashboard /test"', () => {
    expect(sanitizeReturnTo('/dashboard /test')).toBe(fallback);
  });

  it('rejects tab character in path: "/dashboard\\t/test"', () => {
    expect(sanitizeReturnTo('/dashboard\t/test')).toBe(fallback);
  });

  it('rejects newline character in path: "/dashboard\\n/test"', () => {
    expect(sanitizeReturnTo('/dashboard\n/test')).toBe(fallback);
  });

  it('rejects paths exceeding 500 characters', () => {
    const longPath = '/dashboard/' + 'a'.repeat(500);
    expect(sanitizeReturnTo(longPath)).toBe(fallback);
  });

  it('rejects non-whitelisted path: "/unauthorized-path"', () => {
    expect(sanitizeReturnTo('/unauthorized-path')).toBe(fallback);
  });

  it('rejects path spoofing: "/dashboard-fake"', () => {
    // Starts with /dashboard but not followed by /, ?, or #
    expect(sanitizeReturnTo('/dashboard-fake')).toBe(fallback);
  });

  it('rejects disallowed path with query: "/login?redirect=/dashboard"', () => {
    expect(sanitizeReturnTo('/login?redirect=/dashboard')).toBe(fallback);
  });

  it('rejects disallowed path with hash: "/signup#terms"', () => {
    expect(sanitizeReturnTo('/signup#terms')).toBe(fallback);
  });

  it('uses custom fallback when supplied', () => {
    expect(sanitizeReturnTo('/login', '/courses')).toBe('/courses');
  });

  it('rejects malformed URI component', () => {
    expect(sanitizeReturnTo('/dashboard/%E0%A4%A')).toBe(fallback);
  });
});

describe('buildReturnTo', () => {
  it('constructs path with pathname only', () => {
    expect(buildReturnTo({ pathname: '/dashboard' })).toBe('/dashboard');
  });

  it('constructs path with pathname and search query', () => {
    expect(
      buildReturnTo({ pathname: '/courses', search: '?category=tech' })
    ).toBe('/courses?category=tech');
  });

  it('constructs path with pathname, search query, and hash', () => {
    expect(
      buildReturnTo({
        pathname: '/internships',
        search: '?type=remote',
        hash: '#apply',
      })
    ).toBe('/internships?type=remote#apply');
  });

  it('handles empty search and hash gracefully', () => {
    expect(
      buildReturnTo({ pathname: '/employer', search: '', hash: '' })
    ).toBe('/employer');
  });
});

describe('appUrl', () => {
  const originalEnv = import.meta.env.BASE_URL;

  afterEach(() => {
    import.meta.env.BASE_URL = originalEnv;
  });

  it('constructs absolute URL when BASE_URL is "/"', () => {
    import.meta.env.BASE_URL = '/';
    const url = appUrl('/auth/callback?returnTo=%2Fdashboard');
    expect(url).toBe(`${window.location.origin}/auth/callback?returnTo=%2Fdashboard`);
  });

  it('constructs absolute URL when BASE_URL has sub-path "/sub/"', () => {
    import.meta.env.BASE_URL = '/sub/';
    const url = appUrl('/auth/callback');
    expect(url).toBe(`${window.location.origin}/sub/auth/callback`);
  });

  it('constructs absolute URL when BASE_URL is "/sub" without trailing slash', () => {
    import.meta.env.BASE_URL = '/sub';
    const url = appUrl('/update-password');
    expect(url).toBe(`${window.location.origin}/sub/update-password`);
  });

  it('handles path without leading slash', () => {
    import.meta.env.BASE_URL = '/';
    const url = appUrl('auth/callback');
    expect(url).toBe(`${window.location.origin}/auth/callback`);
  });
});

describe('getRoleHome', () => {
  it('returns /admin for admin role array', () => {
    expect(getRoleHome(['admin'])).toBe('/admin');
  });

  it('returns /admin when multiple roles include admin', () => {
    expect(getRoleHome(['student', 'admin'])).toBe('/admin');
  });

  it('returns /employer/dashboard for employer role array', () => {
    expect(getRoleHome(['employer'])).toBe('/employer/dashboard');
  });

  it('returns /dashboard for student role array', () => {
    expect(getRoleHome(['student'])).toBe('/dashboard');
  });

  it('returns /admin for single string "admin"', () => {
    expect(getRoleHome('admin')).toBe('/admin');
  });

  it('returns /employer/dashboard for single string "employer"', () => {
    expect(getRoleHome('employer')).toBe('/employer/dashboard');
  });

  it('returns /dashboard for single string "student"', () => {
    expect(getRoleHome('student')).toBe('/dashboard');
  });

  it('returns /dashboard for unknown role string or null/undefined', () => {
    expect(getRoleHome(null)).toBe('/dashboard');
    expect(getRoleHome(undefined)).toBe('/dashboard');
    expect(getRoleHome([])).toBe('/dashboard');
    expect(getRoleHome('freelancer')).toBe('/dashboard');
  });
});
