import { describe, it, expect } from 'vitest';
import { getDisplayName } from '../displayName';

describe('getDisplayName', () => {
  it('extracts the first word of full_name', () => {
    expect(getDisplayName({ full_name: 'Rahul Sharma' }, { email: 'rahul@example.com' })).toBe('Rahul');
    expect(getDisplayName({ full_name: 'Priya' }, { email: 'priya@example.com' })).toBe('Priya');
    expect(getDisplayName({ full_name: '  Ananya   Verma  ' }, { email: 'ananya@example.com' })).toBe('Ananya');
  });

  it('falls back to email prefix when full_name contains "@"', () => {
    expect(
      getDisplayName(
        { full_name: 'rahul.sharma@example.com' },
        { email: 'rahul.sharma@example.com' }
      )
    ).toBe('rahul.sharma');

    expect(
      getDisplayName(
        { full_name: 'student@aadhyra.com' },
        { email: 'student@aadhyra.com' }
      )
    ).toBe('student');
  });

  it('falls back to email prefix when profile or full_name is empty', () => {
    expect(getDisplayName(null, { email: 'intern@example.com' })).toBe('intern');
    expect(getDisplayName({ full_name: '' }, { email: 'intern@example.com' })).toBe('intern');
    expect(getDisplayName({ full_name: '   ' }, { email: 'intern@example.com' })).toBe('intern');
  });

  it('never returns an empty string even when both profile and user are null or empty', () => {
    expect(getDisplayName(null, null)).toBe('User');
    expect(getDisplayName({ full_name: '' }, { email: '' })).toBe('User');
    expect(getDisplayName({ full_name: null }, { email: null })).toBe('User');
  });
});
