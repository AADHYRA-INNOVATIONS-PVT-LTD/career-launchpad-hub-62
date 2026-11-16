import { ReactNode } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeReturnTo, getRoleHome } from "@/lib/returnTo";
import { AuthSkeleton } from "./AuthSkeleton";

export interface PublicOnlyRouteProps {
  children?: ReactNode;
}

/**
 * Route guard component for public-only auth routes (e.g. /login, /signup).
 * - Displays a full-page skeleton while authentication state is resolving.
 * - Redirects already-authenticated users to their safe returnTo destination or role home.
 * - Renders children or Outlet if unauthenticated.
 */
export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { user, roles, loading } = useAuth();
  const [searchParams] = useSearchParams();

  if (loading) {
    return <AuthSkeleton />;
  }

  if (user) {
    const rawReturnTo =
      searchParams.get("returnTo") ?? searchParams.get("redirect");
    const roleHome = getRoleHome(roles);
    const destination = sanitizeReturnTo(rawReturnTo, roleHome);

    return <Navigate replace to={destination} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicOnlyRoute;
