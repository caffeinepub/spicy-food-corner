import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ProductSummary } from '@/backend';

export function useProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ProductSummary[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('[Products] Fetching products', { actorAvailable: !!actor });
      
      if (!actor) {
        console.error('[Products] Actor not available');
        throw new Error('Unable to connect to the system. Please refresh the page.');
      }
      
      try {
        const products = await actor.getAllProducts();
        console.log('[Products] Fetched successfully', { count: products.length });
        return products;
      } catch (error) {
        console.error('[Products] Fetch failed', {
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          location: window.location.pathname
        });
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
