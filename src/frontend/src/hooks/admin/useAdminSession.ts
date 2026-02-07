import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { normalizeAdminAuthError, isTransientError, AdminAuthErrorType } from '@/utils/adminAuthErrors';

const ADMIN_TOKEN_KEY = 'adminSessionToken';

interface LoginParams {
  username: string;
  password: string;
}

function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string): void {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store admin token:', error);
  }
}

function clearToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear admin token:', error);
  }
}

export function useAdminSession() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['adminSession'],
    queryFn: async () => {
      if (!actor) {
        // Actor not available - keep existing token if present (transient issue)
        const token = getStoredToken();
        return { 
          isAuthenticated: false, 
          token,
          isConnectivityIssue: true 
        };
      }

      const token = getStoredToken();
      if (!token) {
        return { isAuthenticated: false, token: null, isConnectivityIssue: false };
      }

      try {
        const isValid = await actor.isAdminSession(token);
        if (!isValid) {
          // Token is invalid - clear it
          clearToken();
          return { isAuthenticated: false, token: null, isConnectivityIssue: false };
        }
        return { isAuthenticated: true, token, isConnectivityIssue: false };
      } catch (error) {
        console.error('Token validation error:', error);
        
        // Only clear token if it's not a transient connectivity issue
        if (!isTransientError(error)) {
          clearToken();
        }
        
        return { 
          isAuthenticated: false, 
          token: isTransientError(error) ? token : null,
          isConnectivityIssue: isTransientError(error)
        };
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000, // 1 minute
    retry: false,
  });

  return {
    isAuthenticated: query.data?.isAuthenticated || false,
    token: query.data?.token || null,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    isConnectivityIssue: query.data?.isConnectivityIssue || false,
  };
}

export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: LoginParams) => {
      if (!actor) {
        const error = new Error('Actor not available');
        throw error;
      }

      try {
        const token = await actor.loginAdmin(username, password);
        if (!token || token.trim() === '') {
          throw new Error('Invalid credentials');
        }
        storeToken(token);
        return { success: true, token };
      } catch (error) {
        // Re-throw the original error so it can be normalized by the UI
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSession'] });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      clearToken();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function getAdminToken(): string | null {
  return getStoredToken();
}
