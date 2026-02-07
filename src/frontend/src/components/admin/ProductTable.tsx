import { useState } from 'react';
import { Product, ProductCategory } from '@/backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import ProductEditorDialog from './ProductEditorDialog';
import { useDeleteProduct } from '@/hooks/products/useProductMutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id, {
      onSuccess: () => {
        toast.success('Product deleted successfully');
        setDeletingProduct(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to delete product');
      },
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground text-lg">
          No products yet. Click "Add Product" to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image.getDirectURL()}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/placeholder-product.svg';
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>₹{Number(product.price)}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.category === ProductCategory.food ? 'default' : 'secondary'}
                  >
                    {product.category === ProductCategory.food ? 'Food' : 'Grocery'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingProduct(product)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex gap-3">
              <img
                src={product.image.getDirectURL()}
                alt={product.name}
                className="h-20 w-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/assets/placeholder-product.svg';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-xl font-bold text-primary">₹{Number(product.price)}</p>
                <Badge
                  variant={product.category === ProductCategory.food ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {product.category === ProductCategory.food ? 'Food' : 'Grocery'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEditingProduct(product)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setDeletingProduct(product)}
              >
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <ProductEditorDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          mode="edit"
          product={editingProduct}
        />
      )}

      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
