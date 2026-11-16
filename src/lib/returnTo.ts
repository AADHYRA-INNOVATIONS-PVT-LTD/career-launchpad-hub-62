/**
 * Utility functions for safe URL redirection and origin-aware path management.
 */

export const ALLOWED_RETURN_TO_PREFIXES = [
  '/dashboard',
  '/internships',
  '/courses',
  '/employer',
  '/admin',
  '/career',
  '/apply',
  '/freelancer-dashboard',
  '/patient-dashboard',
  '/doctor-dashboard',
] as const;

export const DISALLOWED_RETURN_TO_TARGETS = [
  '/login',
  '/signup',
  '/verify-email',
  '/auth/callback',
] as const;

/**
 * Checks if a string contains any whitespace or control character
 * (ASCII 0x00-0x20, 0x7F-0x9F, or Unicode whitespace).
 */
function hasControlOrWhitespace(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // ASCII control (0x00-0x1F), space (0x20), DEL (0x7F), C1 controls (0x80-0x9F)
    if (code <= 32 || (code >= 127 && code <= 159)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a path has dangerous characteristics:
 * - Not starting with a single '/'
 * - Starting with '//' or '/\'
 * - Containing '//', '\', '://'
 * - Containing control characters or whitespace
 * - Containing 'javascript:' or 'data:'
 */
function hasDangerousCharacteristics(value: string): boolean {
  if (!value.startsWith('/')) {
    return true;
  }
  if (value.startsWith('//') || value.startsWith('/\\')) {
    return true;
  }
  if (value.includes('//') || value.includes('\\') || value.includes('://')) {
    return true;
  }
  if (hasControlOrWhitespace(value)) {
    return true;
  }
  const lower = value.toLowerCase();
  if (lower.includes('javascript:') || lower.includes('data:')) {
    return true;
  }
  return false;
}

/**
 * Validates that a path begins with an allowed prefix and does not target
 * a disallowed authentication route.
 */
function isPathAllowed(value: string): boolean {
  // Disallowed auth pages check
  const isDisallowed = DISALLOWED_RETURN_TO_TARGETS.some((target) => {
    return (
      value === target ||
      value.startsWith(`${target}/`) ||
      value.startsWith(`${target}?`) ||
      value.startsWith(`${target}#`)
    );
  });

  if (isDisallowed) {
    return false;
  }

  // Allowed prefix check
  const isAllowed = ALLOWED_RETURN_TO_PREFIXES.some((prefix) => {
    return (
      value === prefix ||
      value.startsWith(`${prefix}/`) ||
      value.startsWith(`${prefix}?`) ||
      value.startsWith(`${prefix}#`)
    );
  });

  return isAllowed;
}

/**
 * Sanitizes a candidate returnTo URL parameter.
 * Returns the fallback unless raw is a safe same-origin relative path.
 */
export function sanitizeReturnTo(
  raw: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!raw || typeof raw !== 'string') {
    return fallback;
  }

  if (raw.length === 0 || raw.length > 500) {
    return fallback;
  }

  // Check raw value against forbidden patterns
  if (hasDangerousCharacteristics(raw)) {
    return fallback;
  }

  // Decode ONCE and re-check against the same rules
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return fallback;
  }

  if (decoded.length === 0 || decoded.length > 500) {
    return fallback;
  }

  if (hasDangerousCharacteristics(decoded)) {
    return fallback;
  }

  // Check allowed and disallowed route prefixes on both decoded and raw
  if (!isPathAllowed(raw) || !isPathAllowed(decoded)) {
    return fallback;
  }

  return raw;
}

/**
 * Builds a returnTo relative URL path from a location object, preserving search and hash.
 */
export function buildReturnTo(location: {
  pathname: string;
  search?: string;
  hash?: string;
}): string {
  const { pathname, search = '', hash = '' } = location;
  return `${pathname}${search}${hash}`;
}

/**
 * Generates an absolute application URL for authentication redirects, verification links,
 * and email action callbacks.
 * Works across root deployments ("/") and sub-path deployments (e.g. "/sub/").
 */
export function appUrl(path: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';
  const rawBase =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';

  const baseWithoutTrailingSlash =
    rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${origin}${baseWithoutTrailingSlash}${normalizedPath}`;
}

/**
 * Returns the default home destination based on assigned roles or the userRole string.
 * Priority: Admin -> Employer -> Student/Default
 */
export function getRoleHome(rolesOrRole?: string[] | string | null): string {
  if (!rolesOrRole) {
    return '/dashboard';
  }

  if (Array.isArray(rolesOrRole)) {
    if (rolesOrRole.includes('admin')) {
      return '/admin';
    }
    if (rolesOrRole.includes('employer')) {
      return '/employer/dashboard';
    }
    return '/dashboard';
  }

  if (rolesOrRole === 'admin') {
    return '/admin';
  }
  if (rolesOrRole === 'employer') {
    return '/employer/dashboard';
  }

  return '/dashboard';
}
