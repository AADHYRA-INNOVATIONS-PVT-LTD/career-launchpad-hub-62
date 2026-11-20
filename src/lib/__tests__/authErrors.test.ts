import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mapSignupError,
  mapLoginError,
  AUTH_MESSAGES,
} from '../authErrors';

describe('authErrors', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('mapSignupError', () => {
    it('maps rate limit error codes and status 429', () => {
      expect(
        mapSignupError({ code: 'over_email_send_rate_limit' }).message
      ).toBe(AUTH_MESSAGES.RATE_LIMIT);

      expect(
        mapSignupError({ code: 'over_request_rate_limit' }).message
      ).toBe(AUTH_MESSAGES.RATE_LIMIT);

      expect(mapSignupError({ status: 429 }).message).toBe(
        AUTH_MESSAGES.RATE_LIMIT
      );

      expect(
        mapSignupError({ message: 'rate limit exceeded' }).message
      ).toBe(AUTH_MESSAGES.RATE_LIMIT);
    });

    it('maps weak_password code and message', () => {
      const res = mapSignupError({ code: 'weak_password' });
      expect(res.message).toBe(AUTH_MESSAGES.WEAK_PASSWORD);
      expect(res.treatAsSuccess).toBe(false);

      expect(
        mapSignupError({ message: 'Password is too weak' }).message
      ).toBe(AUTH_MESSAGES.WEAK_PASSWORD);
    });

    it('maps email_address_invalid code and message', () => {
      const res = mapSignupError({ code: 'email_address_invalid' });
      expect(res.message).toBe(AUTH_MESSAGES.EMAIL_INVALID);
      expect(res.treatAsSuccess).toBe(false);
    });

    it('maps email_address_not_authorized code and includes dev note when DEV is true', () => {
      const res = mapSignupError({ code: 'email_address_not_authorized' });
      expect(res.message).toContain(
        "We can't send a confirmation email to this address right now. Please contact support."
      );
      if (import.meta.env.DEV) {
        expect(res.message).toContain(
          '(Dev: the built-in Supabase email service only sends to team members. Configure custom SMTP.)'
        );
      }
      expect(res.treatAsSuccess).toBe(false);
    });

    it('maps user_already_exists and email_exists as treatAsSuccess = true without leaking message', () => {
      const res1 = mapSignupError({ code: 'user_already_exists' });
      expect(res1.treatAsSuccess).toBe(true);

      const res2 = mapSignupError({ code: 'email_exists' });
      expect(res2.treatAsSuccess).toBe(true);

      const res3 = mapSignupError({
        message: 'User already registered with this email',
      });
      expect(res3.treatAsSuccess).toBe(true);
    });

    it('maps signup_disabled code and message', () => {
      const res = mapSignupError({ code: 'signup_disabled' });
      expect(res.message).toBe(AUTH_MESSAGES.SIGNUP_DISABLED);
      expect(res.treatAsSuccess).toBe(false);
    });

    it('maps unknown/raw server error to generic safe message without leaking details', () => {
      const raw =
        'duplicate key value violates unique constraint "users_email_key" at postgres:5432';
      const res = mapSignupError({ message: raw, code: '23505' });
      expect(res.message).toBe(AUTH_MESSAGES.GENERIC);
      expect(res.message).not.toContain('postgres');
      expect(res.message).not.toContain('violates');
      expect(res.treatAsSuccess).toBe(false);
    });
  });

  describe('mapLoginError', () => {
    it('maps rate limit error codes and status 429', () => {
      expect(mapLoginError({ code: 'over_request_rate_limit' }).message).toBe(
        AUTH_MESSAGES.RATE_LIMIT
      );
      expect(mapLoginError({ status: 429 }).message).toBe(
        AUTH_MESSAGES.RATE_LIMIT
      );
    });

    it('maps email_not_confirmed with isEmailNotConfirmed = true', () => {
      const res = mapLoginError({ code: 'email_not_confirmed' });
      expect(res.message).toBe(AUTH_MESSAGES.EMAIL_NOT_CONFIRMED);
      expect(res.isEmailNotConfirmed).toBe(true);

      const resMsg = mapLoginError({ message: 'Email not confirmed' });
      expect(resMsg.message).toBe(AUTH_MESSAGES.EMAIL_NOT_CONFIRMED);
      expect(resMsg.isEmailNotConfirmed).toBe(true);
    });

    it('maps invalid_credentials and invalid_grant to friendly message', () => {
      const res1 = mapLoginError({ code: 'invalid_credentials' });
      expect(res1.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
      expect(res1.isEmailNotConfirmed).toBe(false);

      const res2 = mapLoginError({ code: 'invalid_grant' });
      expect(res2.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);

      const res3 = mapLoginError({ message: 'Invalid login credentials' });
      expect(res3.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
    });

    it('maps email_address_invalid', () => {
      const res = mapLoginError({ code: 'email_address_invalid' });
      expect(res.message).toBe(AUTH_MESSAGES.EMAIL_INVALID);
    });

    it('maps unknown/raw server error to generic safe message without leaking internal details', () => {
      const raw = 'database connection timed out while querying auth.users';
      const res = mapLoginError({ message: raw });
      expect(res.message).toBe(AUTH_MESSAGES.GENERIC);
      expect(res.message).not.toContain('database');
      expect(res.message).not.toContain('auth.users');
      expect(res.isEmailNotConfirmed).toBe(false);
    });
  });

  describe('dev logging', () => {
    it('logs console.warn when code is provided in dev mode', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mapLoginError({ code: 'invalid_credentials', status: 400 });
      if (import.meta.env.DEV) {
        expect(warnSpy).toHaveBeenCalledWith(
          '[auth] failed',
          'invalid_credentials',
          400
        );
      }
    });
  });
});
