import React from 'react';
import { Link } from 'react-router-dom';

interface ResendHelpProps {
  loginUrl?: string;
  contactUrl?: string;
  className?: string;
}

export const ResendHelp: React.FC<ResendHelpProps> = ({
  loginUrl = '/login',
  contactUrl = '/contact',
  className = '',
}) => {
  return (
    <div className={`text-xs text-muted-foreground pt-3 ${className}`}>
      <p>
        Didn't get the email? Check your spam folder. If you already verified,{' '}
        <Link to={loginUrl} className="text-primary hover:underline font-medium">
          log in
        </Link>
        . Still stuck?{' '}
        <Link to={contactUrl} className="text-primary hover:underline font-medium">
          Contact support
        </Link>
        .
      </p>
    </div>
  );
};

export default ResendHelp;
