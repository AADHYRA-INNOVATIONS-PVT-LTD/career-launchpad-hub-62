import { z } from 'zod';

/**
 * Normalizes Indian mobile numbers into the standard +91XXXXXXXXXX format.
 * Accepts formats like:
 * - 9876543210
 * - +919876543210
 * - 919876543210
 * - 09876543210
 * With optional spaces, dashes, or parentheses.
 *
 * Returns +91XXXXXXXXXX only if it matches ^\+91[6-9][0-9]{9}$, else null.
 */
export function normalizeIndianMobile(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Remove spaces, dashes, dots, and parentheses
  const cleaned = trimmed.replace(/[\s\-.()]/g, '');

  let digitsOnly = cleaned;
  if (cleaned.startsWith('+91')) {
    digitsOnly = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    digitsOnly = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    digitsOnly = cleaned.slice(1);
  }

  // Digits only must be exactly 10 digits starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    const formatted = `+91${digitsOnly}`;
    if (/^\+91[6-9][0-9]{9}$/.test(formatted)) {
      return formatted;
    }
  }

  return null;
}

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(72, 'Password must not exceed 72 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Shared password validation rule:
 * - 8 to 72 characters
 * - At least one letter
 * - At least one digit
 */
export const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must not exceed 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one digit');

export const updatePasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s.'-]+$/,
        "Name can only contain letters, spaces, dots, hyphens, and apostrophes"
      ),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .transform((val) => val.toLowerCase()),
    mobile: z
      .string()
      .trim()
      .min(1, 'Mobile number is required')
      .refine(
        (val) => normalizeIndianMobile(val) !== null,
        'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'
      ),
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service and Privacy Policy',
    }),
    website: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  hint: string;
}

/**
 * Evaluates password strength returning a score of 0-4 and a hint string.
 */
export function passwordStrength(pw?: string | null): PasswordStrengthResult {
  if (!pw || pw.length === 0) {
    return { score: 0, hint: 'Enter a password' };
  }

  if (pw.length < 8) {
    return { score: 1, hint: 'Too short (min 8 characters)' };
  }

  let score = 1;
  const hasLetters = /[a-zA-Z]/.test(pw);
  const hasDigits = /\d/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  if (hasLetters && hasDigits) {
    score += 1;
  }

  if (hasUpper && hasLower) {
    score += 1;
  }

  if (hasSpecial || pw.length >= 12) {
    score += 1;
  }

  score = Math.min(4, Math.max(1, score));

  let hint = 'Weak';
  switch (score) {
    case 1:
      hint = 'Weak (add letters and numbers)';
      break;
    case 2:
      hint = 'Fair';
      break;
    case 3:
      hint = 'Good';
      break;
    case 4:
      hint = 'Strong';
      break;
  }

  return { score, hint };
}
