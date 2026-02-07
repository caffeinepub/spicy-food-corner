import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { ProductCategory, ExternalBlob } from '@/backend';
import { toast } from 'sonner';
import { getAdminToken } from '../admin/useAdminSession';

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
      
      const token = getAdminToken();
      if (!token) {
        throw new Error('Admin login is required');
      }

      try {
        return await actor.createProduct(token, {
          name: params.name,
          price: params.price,
          category: params.category,
          image: params.image,
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('Admin login is required');
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
      
      const token = getAdminToken();
      if (!token) {
        throw new Error('Admin login is required');
      }

      try {
        return await actor.updateProduct(token, params.id, {
          name: params.name,
          price: params.price,
          category: params.category,
          image: params.image,
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('Admin login is required');
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
      
      const token = getAdminToken();
      if (!token) {
        throw new Error('Admin login is required');
      }

      try {
        return await actor.deleteProduct(token, id);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          throw new Error('Admin login is required');
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
