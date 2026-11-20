/**
 * Computes a user-friendly display name:
 * - First word of profile.full_name.
 * - If that text contains "@" or is empty, use the part of the email before "@".
 * - Never returns an empty string (falls back to "User").
 */
export function getDisplayName(
  profile?: { full_name?: string | null } | null,
  user?: { email?: string | null } | null
): string {
  const rawFullName = profile?.full_name?.trim();
  if (rawFullName) {
    const firstWord = rawFullName.split(/\s+/)[0];
    if (firstWord && !firstWord.includes('@')) {
      return firstWord;
    }
  }

  const email = user?.email?.trim();
  if (email && email.includes('@')) {
    const emailPrefix = email.split('@')[0].trim();
    if (emailPrefix) {
      return emailPrefix;
    }
  }

  return 'User';
}
