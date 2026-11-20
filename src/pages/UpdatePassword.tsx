import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { updatePasswordSchema } from '@/lib/authSchemas';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [isRecoveryValid, setIsRecoveryValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let resolved = false;

    // Check if the user arrived here via a password reset link
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        resolved = true;
        setIsRecoveryValid(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        resolved = true;
        setIsRecoveryValid(true);
      }
    });

    // If no recovery session is detected within 6 seconds, mark link as expired
    const timer = setTimeout(() => {
      if (!resolved) {
        setIsRecoveryValid(false);
      }
    }, 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = updatePasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as 'password' | 'confirmPassword';
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      toast({
        title: 'Failed to update password',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated. You can now log in.',
      });
      // Sign out to ensure they log in with the new password cleanly
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  if (isRecoveryValid === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">Link Expired</CardTitle>
              <CardDescription>
                This reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Password reset links are only valid once and expire after a limited time.
              </p>
              <Link to="/forgot-password">
                <Button className="w-full">Request New Reset Link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isRecoveryValid === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Update Password</CardTitle>
            <CardDescription>
              Enter a new strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    className="pl-10"
                    aria-invalid={!!errors.password}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className="pl-10"
                    aria-invalid={!!errors.confirmPassword}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;
