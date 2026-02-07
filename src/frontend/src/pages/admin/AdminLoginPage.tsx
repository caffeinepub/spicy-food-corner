import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminLogin } from '@/hooks/admin/useAdminSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, AlertCircle, WifiOff } from 'lucide-react';
import { normalizeAdminAuthError, AdminAuthErrorType } from '@/utils/adminAuthErrors';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: login, isPending, error, reset } = useAdminLogin();

  // Clear error when user changes input
  useEffect(() => {
    if (error) {
      reset();
    }
  }, [username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous error before attempting login
    reset();
    
    login(
      { username, password },
      {
        onSuccess: () => {
          navigate({ to: '/admin/dashboard' });
        },
      }
    );
  };

  // Normalize the error for display
  const normalizedError = error ? normalizeAdminAuthError(error) : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isPending}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                autoComplete="current-password"
              />
            </div>

            {normalizedError && (
              <Alert variant="destructive">
                <div className="flex items-start gap-2">
                  {normalizedError.type === AdminAuthErrorType.CONNECTIVITY_ISSUE ? (
                    <WifiOff className="h-4 w-4 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <AlertDescription className="flex-1">
                    {normalizedError.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
