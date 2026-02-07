import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ProductSummary } from '@/backend';

export function useProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductSummary[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000, // 30 seconds
  });
}
