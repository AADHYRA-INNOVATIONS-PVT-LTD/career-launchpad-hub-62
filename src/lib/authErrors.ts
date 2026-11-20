/**
 * Authentication error mapping utilities.
 * Maps Supabase auth error codes, HTTP statuses, and fallback messages to safe user-facing text.
 * Never leaks raw server, database, or token errors to the user.
 */

export interface MappedSignupError {
  message: string;
  treatAsSuccess: boolean;
}

export interface MappedLoginError {
  message: string;
  isEmailNotConfirmed: boolean;
}

export const AUTH_MESSAGES = {
  RATE_LIMIT: 'Too many attempts. Please wait a few minutes and try again.',
  WEAK_PASSWORD:
    'Password does not meet security requirements. Please use at least 8 characters with letters and numbers.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  EMAIL_NOT_AUTHORIZED_BASE:
    "We can't send a confirmation email to this address right now. Please contact support.",
  EMAIL_NOT_AUTHORIZED_DEV:
    ' (Dev: the built-in Supabase email service only sends to team members. Configure custom SMTP.)',
  SIGNUP_DISABLED: 'Sign ups are temporarily unavailable.',
  EMAIL_NOT_CONFIRMED:
    'Please verify your email before logging in. Check your inbox for the confirmation link.',
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

function extractErrorInfo(err: unknown): {
  code: string;
  status: number | undefined;
  message: string;
} {
  let code = '';
  let status: number | undefined;
  let message = '';

  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (typeof errorObj.code === 'string') {
      code = errorObj.code.trim();
    }
    if (typeof errorObj.status === 'number') {
      status = errorObj.status;
    }
    if (typeof errorObj.message === 'string') {
      message = errorObj.message;
    }
  } else if (typeof err === 'string') {
    message = err;
  }

  return { code, status, message };
}

function logAuthWarning(code: string, status?: number) {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.warn('[auth] failed', code, status);
  }
}

/**
 * Maps sign-up errors from Supabase into safe, friendly messages.
 * When user_already_exists or email_exists is received, returns treatAsSuccess = true
 * so the application can navigate to /verify-email without revealing account existence.
 */
export function mapSignupError(err: unknown): MappedSignupError {
  const { code, status, message } = extractErrorInfo(err);
  logAuthWarning(code, status);

  const lowerCode = code.toLowerCase();
  const lowerMsg = message.toLowerCase();

  // 1. Rate limiting
  if (
    lowerCode === 'over_email_send_rate_limit' ||
    lowerCode === 'over_request_rate_limit' ||
    status === 429 ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('too many') ||
    lowerMsg.includes('429')
  ) {
    return { message: AUTH_MESSAGES.RATE_LIMIT, treatAsSuccess: false };
  }

  // 2. Weak password
  if (
    lowerCode === 'weak_password' ||
    lowerMsg.includes('weak password') ||
    lowerMsg.includes('password is too weak') ||
    lowerMsg.includes('should be at least')
  ) {
    return { message: AUTH_MESSAGES.WEAK_PASSWORD, treatAsSuccess: false };
  }

  // 3. Email invalid
  if (
    lowerCode === 'email_address_invalid' ||
    lowerMsg.includes('email address invalid') ||
    lowerMsg.includes('invalid email')
  ) {
    return { message: AUTH_MESSAGES.EMAIL_INVALID, treatAsSuccess: false };
  }

  // 4. Email not authorized
  if (
    lowerCode === 'email_address_not_authorized' ||
    lowerMsg.includes('email address not authorized') ||
    lowerMsg.includes('not authorized to send')
  ) {
    const isDev =
      typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
    const msg =
      AUTH_MESSAGES.EMAIL_NOT_AUTHORIZED_BASE +
      (isDev ? AUTH_MESSAGES.EMAIL_NOT_AUTHORIZED_DEV : '');
    return { message: msg, treatAsSuccess: false };
  }

  // 5. User already exists / email exists -> treat as success
  if (
    lowerCode === 'user_already_exists' ||
    lowerCode === 'email_exists' ||
    lowerMsg.includes('user already registered') ||
    lowerMsg.includes('already registered') ||
    lowerMsg.includes('already exists')
  ) {
    return { message: '', treatAsSuccess: true };
  }

  // 6. Signups disabled
  if (
    lowerCode === 'signup_disabled' ||
    lowerMsg.includes('signup disabled') ||
    lowerMsg.includes('signups not allowed')
  ) {
    return { message: AUTH_MESSAGES.SIGNUP_DISABLED, treatAsSuccess: false };
  }

  // 7. Generic fallback (never leak raw message)
  return { message: AUTH_MESSAGES.GENERIC, treatAsSuccess: false };
}

/**
 * Maps login errors from Supabase into safe, friendly messages.
 * Identifies unconfirmed email addresses to allow triggering verification resend.
 */
export function mapLoginError(err: unknown): MappedLoginError {
  const { code, status, message } = extractErrorInfo(err);
  logAuthWarning(code, status);

  const lowerCode = code.toLowerCase();
  const lowerMsg = message.toLowerCase();

  // 1. Rate limiting
  if (
    lowerCode === 'over_email_send_rate_limit' ||
    lowerCode === 'over_request_rate_limit' ||
    status === 429 ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('too many') ||
    lowerMsg.includes('429')
  ) {
    return { message: AUTH_MESSAGES.RATE_LIMIT, isEmailNotConfirmed: false };
  }

  // 2. Email not confirmed
  if (
    lowerCode === 'email_not_confirmed' ||
    lowerMsg.includes('email not confirmed')
  ) {
    return {
      message: AUTH_MESSAGES.EMAIL_NOT_CONFIRMED,
      isEmailNotConfirmed: true,
    };
  }

  // 3. Invalid credentials
  if (
    lowerCode === 'invalid_credentials' ||
    lowerCode === 'invalid_grant' ||
    lowerMsg.includes('invalid login credentials') ||
    lowerMsg.includes('invalid credentials')
  ) {
    return {
      message: AUTH_MESSAGES.INVALID_CREDENTIALS,
      isEmailNotConfirmed: false,
    };
  }

  // 4. Email invalid
  if (
    lowerCode === 'email_address_invalid' ||
    lowerMsg.includes('email address invalid')
  ) {
    return { message: AUTH_MESSAGES.EMAIL_INVALID, isEmailNotConfirmed: false };
  }

  // 5. Generic fallback (never leak raw message)
  return { message: AUTH_MESSAGES.GENERIC, isEmailNotConfirmed: false };
}
