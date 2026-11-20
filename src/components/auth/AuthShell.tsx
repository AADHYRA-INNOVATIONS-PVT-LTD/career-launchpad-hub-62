import React from 'react';
import { Link } from 'react-router-dom';
import aadhyraLogo from '@/assets/aadhyra-logo.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-8 sm:py-12">
      {/* Brand Header with link back to Home */}
      <Link
        to="/"
        className="flex items-center gap-3 mb-6 group transition-opacity hover:opacity-90"
        title="Back to home"
      >
        <img
          src={aadhyraLogo}
          alt="Aadhyra Innovations"
          className="h-10 w-auto shrink-0 transition-transform group-hover:scale-105"
        />
        <div className="flex flex-col">
          <span className="font-heading font-bold text-foreground text-lg leading-tight">
            Aadhyra Innovations
          </span>
          <span className="text-xs text-primary font-medium tracking-wide">
            Student & Career Portal
          </span>
        </div>
      </Link>

      {/* Main Container Card */}
      <Card className="w-full max-w-[420px] shadow-card border-border/80 border-t-4 border-t-primary rounded-2xl transition-all">
        <CardHeader className="text-center pb-4 pt-6 px-6">
          <CardTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          {children}
          {footer && <div className="mt-6 pt-4 border-t border-border/60">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthShell;
