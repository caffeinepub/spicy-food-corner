import { useState } from 'react';
import { ProductSummary, ProductCategory } from '@/backend';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
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

interface ProductTableProps {
  products: ProductSummary[];
  onAddProduct: () => void;
}

export default function ProductTable({ products, onAddProduct }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<ProductSummary | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductSummary | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id, {
      onSuccess: () => {
        setDeletingProduct(null);
      },
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <div className="space-y-4">
          <p className="text-muted-foreground text-lg">
            No products yet. Click "Add Product" to get started.
          </p>
          <Button onClick={onAddProduct} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar with Add Product button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        <Button onClick={onAddProduct} size="sm" className="hidden md:flex">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

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
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>₹{Number(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.category === ProductCategory.food ? 'default' : 'secondary'}>
                    {product.category === ProductCategory.food ? '🍛 Food' : '🛒 Grocery'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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
            <div className="flex gap-4">
              <img
                src={product.image.getDirectURL()}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-lg font-bold text-primary">₹{Number(product.price)}</p>
                <Badge
                  variant={product.category === ProductCategory.food ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {product.category === ProductCategory.food ? '🍛 Food' : '🛒 Grocery'}
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
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => setDeletingProduct(product)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingProduct && (
        <ProductEditorDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          mode="edit"
          product={editingProduct}
        />
      )}

      {/* Delete Confirmation */}
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
