import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import LegacyAuthEntry from '../LegacyAuthEntry';

vi.mock('@/pages/AuthPage', () => ({
  default: () => <div data-testid="legacy-auth-page">Legacy Auth Page</div>,
}));

// Helper component that prints the current location to verify search params
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="login-page">
      Login Page: {location.pathname}
      {location.search}
    </div>
  );
};

describe('LegacyAuthEntry', () => {
  const renderWithRoute = (initialPath: string) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/auth" element={<LegacyAuthEntry />} />
          <Route path="/login" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('no role: redirects to /login preserving safe returnTo', () => {
    renderWithRoute('/auth?returnTo=/internships');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login?returnTo=%2Finternships'
    );
    expect(screen.queryByTestId('legacy-auth-page')).toBeNull();
  });

  it('no role: redirects to /login preserving safe redirect as returnTo', () => {
    renderWithRoute('/auth?redirect=/courses/it');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login?returnTo=%2Fcourses%2Fit'
    );
    expect(screen.queryByTestId('legacy-auth-page')).toBeNull();
  });

  it('no role without returnTo or redirect: redirects to /login cleanly', () => {
    renderWithRoute('/auth');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login'
    );
    expect(screen.queryByTestId('legacy-auth-page')).toBeNull();
  });

  it('role=student: redirects to /login', () => {
    renderWithRoute('/auth?role=student');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login'
    );
    expect(screen.queryByTestId('legacy-auth-page')).toBeNull();
  });

  it('role=candidate: redirects to /login', () => {
    renderWithRoute('/auth?role=candidate');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login'
    );
    expect(screen.queryByTestId('legacy-auth-page')).toBeNull();
  });

  it('role=freelancer: renders the existing AuthPage', () => {
    renderWithRoute('/auth?role=freelancer');
    expect(screen.getByTestId('legacy-auth-page')).toBeDefined();
    expect(screen.queryByTestId('login-page')).toBeNull();
  });

  it('drops malicious redirect values (e.g. external origin or javascript)', () => {
    renderWithRoute('/auth?redirect=https://evil.com');
    expect(screen.getByTestId('login-page').textContent).toBe(
      'Login Page: /login'
    );

    renderWithRoute('/auth?returnTo=//attacker.com');
    expect(screen.getAllByTestId('login-page')[1].textContent).toBe(
      'Login Page: /login'
    );

    renderWithRoute('/auth?redirect=javascript:alert(1)');
    expect(screen.getAllByTestId('login-page')[2].textContent).toBe(
      'Login Page: /login'
    );
  });
});
