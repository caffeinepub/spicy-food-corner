import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { storeSessionParameter, getSessionParameter, clearSessionParameter } from '@/utils/urlParams';

const ADMIN_SESSION_KEY = 'adminAuthenticated';

interface LoginParams {
  username: string;
  password: string;
}

export function useAdminSession() {
  const { actor } = useActor();

  const query = useQuery({
    queryKey: ['adminSession'],
    queryFn: async () => {
      const isAuthenticated = getSessionParameter(ADMIN_SESSION_KEY) === 'true';
      if (!isAuthenticated || !actor) return { isAuthenticated: false };

      try {
        const isAdmin = await actor.isCallerAdmin();
        return { isAuthenticated: isAdmin };
      } catch {
        clearSessionParameter(ADMIN_SESSION_KEY);
        return { isAuthenticated: false };
      }
    },
    enabled: !!actor,
    staleTime: 60000, // 1 minute
  });

  return {
    isAuthenticated: query.data?.isAuthenticated || false,
    isLoading: query.isLoading,
  };
}

export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: LoginParams) => {
      if (!actor) throw new Error('Actor not available');

      // Trim whitespace from inputs
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      // Validate credentials
      if (trimmedUsername !== 'foodram corner' || trimmedPassword !== 'ram4792sa') {
        throw new Error('Invalid username or password');
      }

      // Verify admin status with backend
      try {
        const isAdmin = await actor.isCallerAdmin();
        if (!isAdmin) {
          throw new Error('Invalid credentials or insufficient permissions');
        }
        storeSessionParameter(ADMIN_SESSION_KEY, 'true');
        return { success: true };
      } catch (error) {
        throw new Error('Invalid username or password');
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
      clearSessionParameter(ADMIN_SESSION_KEY);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
