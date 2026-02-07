import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ProductCategory, ExternalBlob } from '@/backend';
import { toast } from 'sonner';

interface CreateProductParams {
  name: string;
  price: bigint;
  category: ProductCategory;
  image: ExternalBlob;
}

interface UpdateProductParams {
  id: string;
  name: string;
  price: bigint;
  category: ProductCategory;
  image: ExternalBlob;
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateProductParams) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createProduct(params.name, params.price, params.category, params.image);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('You must be logged in as admin to create products');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateProductParams) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateProduct(params.id, params.name, params.price, params.category, params.image);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('You must be logged in as admin to update products');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteProduct(id);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('You must be logged in as admin to delete products');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    },
  });
}
