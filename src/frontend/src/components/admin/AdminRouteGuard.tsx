import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '@/hooks/admin/useAdminSession';
import { Loader2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isLoading, isFetched, isConnectivityIssue } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect to login if we've fetched and user is not authenticated
    // AND it's not just a connectivity issue (which might be transient)
    if (isFetched && !isAuthenticated && !isConnectivityIssue) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isFetched, isConnectivityIssue, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show connectivity warning but don't redirect if there's a stored token
  if (isConnectivityIssue && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <div className="flex items-start gap-2">
              <WifiOff className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <AlertDescription className="font-medium mb-1">
                  Connection Issue
                </AlertDescription>
                <AlertDescription className="text-sm">
                  Unable to verify your session. Please check your connection and refresh the page.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
