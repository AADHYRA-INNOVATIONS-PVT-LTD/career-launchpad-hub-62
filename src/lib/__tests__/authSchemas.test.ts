import { describe, it, expect } from 'vitest';
import {
  normalizeIndianMobile,
  loginSchema,
  signupSchema,
  passwordStrength,
  passwordRule,
  updatePasswordSchema,
} from '../authSchemas';

describe('authSchemas', () => {
  describe('normalizeIndianMobile', () => {
    it('normalizes standard 10-digit numbers starting with 6-9', () => {
      expect(normalizeIndianMobile('9876543210')).toBe('+919876543210');
      expect(normalizeIndianMobile('8123456789')).toBe('+918123456789');
      expect(normalizeIndianMobile('7123456789')).toBe('+917123456789');
      expect(normalizeIndianMobile('6123456789')).toBe('+916123456789');
    });

    it('normalizes numbers with +91 prefix', () => {
      expect(normalizeIndianMobile('+919876543210')).toBe('+919876543210');
    });

    it('normalizes numbers with 91 prefix without plus', () => {
      expect(normalizeIndianMobile('919876543210')).toBe('+919876543210');
    });

    it('normalizes numbers with leading 0 (trunk code)', () => {
      expect(normalizeIndianMobile('09876543210')).toBe('+919876543210');
    });

    it('handles spaces, dashes, dots, and parentheses', () => {
      expect(normalizeIndianMobile(' +91 98765-43210 ')).toBe('+919876543210');
      expect(normalizeIndianMobile('(0987) 654-3210')).toBe('+919876543210');
      expect(normalizeIndianMobile('98765.43210')).toBe('+919876543210');
    });

    it('rejects invalid mobile numbers', () => {
      expect(normalizeIndianMobile('5876543210')).toBeNull(); // Starts with 5
      expect(normalizeIndianMobile('1234567890')).toBeNull(); // Starts with 1
      expect(normalizeIndianMobile('98765')).toBeNull(); // Too short
      expect(normalizeIndianMobile('98765432109999')).toBeNull(); // Too long
      expect(normalizeIndianMobile('+19876543210')).toBeNull(); // US country code
      expect(normalizeIndianMobile('')).toBeNull();
      expect(normalizeIndianMobile(null)).toBeNull();
      expect(normalizeIndianMobile(undefined)).toBeNull();
      expect(normalizeIndianMobile('abcdefghij')).toBeNull();
    });
  });

  describe('loginSchema', () => {
    it('trims and lowercases valid email', () => {
      const res = loginSchema.safeParse({
        email: '  STUDENT@EXAMPLE.COM  ',
        password: 'Password123!',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe('student@example.com');
        expect(res.data.password).toBe('Password123!');
      }
    });

    it('rejects invalid emails and empty passwords', () => {
      const invalidEmail = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'Password123!',
      });
      expect(invalidEmail.success).toBe(false);

      const emptyPassword = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(emptyPassword.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    const validData = {
      fullName: 'Aarav Sharma',
      email: 'AARAV@EXAMPLE.COM',
      mobile: '9876543210',
      password: 'SecurePassword1',
      confirmPassword: 'SecurePassword1',
      acceptTerms: true,
    };

    it('validates correct sign-up payload and transforms email', () => {
      const res = signupSchema.safeParse(validData);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe('aarav@example.com');
      }
    });

    it('validates fullName rules', () => {
      const shortName = signupSchema.safeParse({ ...validData, fullName: 'A' });
      expect(shortName.success).toBe(false);

      const invalidChars = signupSchema.safeParse({
        ...validData,
        fullName: 'Aarav123',
      });
      expect(invalidChars.success).toBe(false);

      const validPunctuation = signupSchema.safeParse({
        ...validData,
        fullName: "O'Connor D. Smith-Jones",
      });
      expect(validPunctuation.success).toBe(true);
    });

    it('rejects passwords with fewer than 8 chars, or missing letters/numbers', () => {
      const tooShort = signupSchema.safeParse({
        ...validData,
        password: 'Pass1',
        confirmPassword: 'Pass1',
      });
      expect(tooShort.success).toBe(false);

      const noDigits = signupSchema.safeParse({
        ...validData,
        password: 'OnlyLettersPassword',
        confirmPassword: 'OnlyLettersPassword',
      });
      expect(noDigits.success).toBe(false);

      const noLetters = signupSchema.safeParse({
        ...validData,
        password: '1234567890',
        confirmPassword: '1234567890',
      });
      expect(noLetters.success).toBe(false);
    });

    it('rejects mismatched confirmPassword', () => {
      const res = signupSchema.safeParse({
        ...validData,
        confirmPassword: 'DifferentPassword2',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const paths = res.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('confirmPassword');
      }
    });

    it('requires acceptTerms to be true', () => {
      const res = signupSchema.safeParse({
        ...validData,
        acceptTerms: false,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('passwordStrength', () => {
    it('returns score 0 for empty password', () => {
      expect(passwordStrength('').score).toBe(0);
      expect(passwordStrength(null).score).toBe(0);
    });

    it('returns score 1 for passwords under 8 characters', () => {
      expect(passwordStrength('short').score).toBe(1);
      expect(passwordStrength('1234567').score).toBe(1);
    });

    it('grades progressively stronger passwords up to score 4', () => {
      const fair = passwordStrength('simple12'); // letters + digits
      expect(fair.score).toBeGreaterThanOrEqual(2);

      const good = passwordStrength('SimplePass12'); // upper + lower + digits
      expect(good.score).toBeGreaterThanOrEqual(3);

      const strong = passwordStrength('Super$ecure#Pass123!');
      expect(strong.score).toBe(4);
      expect(strong.hint).toBe('Strong');
    });
  });

  describe('passwordRule', () => {
    it('accepts passwords with 8-72 characters containing at least one letter and one digit', () => {
      expect(passwordRule.safeParse('Password123').success).toBe(true);
      expect(passwordRule.safeParse('a1' + 'x'.repeat(6)) .success).toBe(true);
      expect(passwordRule.safeParse('a1' + 'x'.repeat(70)).success).toBe(true);
    });

    it('rejects passwords shorter than 8 characters', () => {
      const res = passwordRule.safeParse('Pass1');
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toMatch(/at least 8 characters/i);
      }
    });

    it('rejects passwords longer than 72 characters', () => {
      const res = passwordRule.safeParse('A1' + 'x'.repeat(71));
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toMatch(/not exceed 72 characters/i);
      }
    });

    it('rejects passwords with no letters', () => {
      const res = passwordRule.safeParse('1234567890');
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toMatch(/at least one letter/i);
      }
    });

    it('rejects passwords with no digits', () => {
      const res = passwordRule.safeParse('OnlyLettersPassword');
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toMatch(/at least one digit/i);
      }
    });
  });

  describe('updatePasswordSchema', () => {
    it('accepts matching valid passwords', () => {
      const res = updatePasswordSchema.safeParse({
        password: 'ValidPassword1',
        confirmPassword: 'ValidPassword1',
      });
      expect(res.success).toBe(true);
    });

    it('rejects mismatched passwords with confirmPassword error', () => {
      const res = updatePasswordSchema.safeParse({
        password: 'ValidPassword1',
        confirmPassword: 'MismatchPassword2',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].path).toContain('confirmPassword');
        expect(res.error.issues[0].message).toMatch(/passwords do not match/i);
      }
    });

    it('rejects invalid password according to passwordRule', () => {
      const res = updatePasswordSchema.safeParse({
        password: 'short',
        confirmPassword: 'short',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].path).toContain('password');
      }
    });
  });
});
