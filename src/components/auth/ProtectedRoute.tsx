import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth, type AppRole } from "@/contexts/AuthContext";
import { buildReturnTo } from "@/lib/returnTo";
import { AuthSkeleton } from "./AuthSkeleton";
import { AccessDenied } from "./AccessDenied";

export interface ProtectedRouteProps {
  roles?: AppRole[];
  children?: ReactNode;
}

/**
 * Route guard component protecting authenticated views.
 * Supports both direct wrapper and nested route (Outlet) execution.
 * - Displays a full-page skeleton while authentication state is resolving.
 * - Displays a recovery card if auth state loading failed after retries (authError).
 * - Redirects unauthenticated visitors to /login with an encoded returnTo destination.
 * - Renders a 403 AccessDenied page if specific roles are required but missing.
 */
export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { user, roles: userRoles, loading, authError, retryAuth } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSkeleton />;
  }

  if (authError) {
    return (
      <div
        data-testid="auth-error-card"
        className="min-h-screen w-full bg-background flex items-center justify-center p-4"
      >
        <Card className="max-w-md w-full border-border/60 shadow-lg text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold">
              We couldn't load your account
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              There was a problem loading your account credentials and roles. Please check your connection and retry.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Button
              className="w-full gap-2"
              onClick={() => retryAuth()}
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    const returnTo = encodeURIComponent(buildReturnTo(location));
    return <Navigate replace to={`/login?returnTo=${returnTo}`} />;
  }

  if (roles && roles.length > 0) {
    const hasAuthorizedRole = roles.some((requiredRole) =>
      userRoles.includes(requiredRole)
    );

    if (!hasAuthorizedRole) {
      return <AccessDenied requiredRoles={roles} userRoles={userRoles} />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
