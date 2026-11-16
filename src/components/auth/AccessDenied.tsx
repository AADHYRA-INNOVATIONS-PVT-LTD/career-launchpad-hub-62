import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth, type AppRole } from "@/contexts/AuthContext";
import { getRoleHome } from "@/lib/returnTo";

export interface AccessDeniedProps {
  requiredRoles?: AppRole[];
  userRoles?: AppRole[];
}

export const AccessDenied = ({ requiredRoles }: AccessDeniedProps) => {
  const { roles, userRole } = useAuth();
  const homePath = getRoleHome(roles?.length ? roles : userRole);

  return (
    <div
      data-testid="access-denied"
      className="min-h-screen w-full bg-background flex items-center justify-center p-4"
    >
      <Card className="max-w-md w-full border-border/60 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
            Error 403
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Access Denied
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            You do not have the required permissions to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground space-y-2">
          {requiredRoles && requiredRoles.length > 0 && (
            <p className="bg-muted/50 py-2 px-3 rounded-md text-xs font-mono">
              Required role: {requiredRoles.join(" or ")}
            </p>
          )}
          <p>
            If you believe this is an error, please contact your administrator or return to your assigned portal.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            asChild
            variant="default"
            className="w-full gap-2"
          >
            <Link to={homePath}>
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
