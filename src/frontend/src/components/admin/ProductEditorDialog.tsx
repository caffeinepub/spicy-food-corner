import { useState, useEffect } from 'react';
import { ProductSummary, ProductCategory } from '@/backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImagePicker from './ImagePicker';
import { useCreateProduct, useUpdateProduct } from '@/hooks/products/useProductMutations';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProductEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: ProductSummary;
}

export default function ProductEditorDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductEditorDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.food);
  const [image, setImage] = useState<ExternalBlob | null>(null);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating;

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && product) {
        setName(product.name);
        setPrice(String(Number(product.price)));
        setCategory(product.category);
        setImage(product.image);
      } else {
        // Reset to defaults for create mode
        setName('');
        setPrice('');
        setCategory(ProductCategory.food);
        setImage(null);
      }
    }
  }, [mode, product, open]);

  // Additional cleanup when dialog closes
  useEffect(() => {
    if (!open && mode === 'create') {
      // Ensure form is completely reset when create dialog closes
      setName('');
      setPrice('');
      setCategory(ProductCategory.food);
      setImage(null);
    }
  }, [open, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    const priceValue = BigInt(Math.round(parseFloat(price)));

    if (mode === 'create') {
      createProduct(
        { name, price: priceValue, category, image },
        {
          onSuccess: () => {
            // Close dialog and reset form
            onOpenChange(false);
            // Form will be reset by useEffect when open becomes false
          },
        }
      );
    } else if (mode === 'edit' && product) {
      updateProduct(
        { id: product.id, name, price: priceValue, category, image },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details to add a new product to your inventory.'
              : 'Update the product details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <ImagePicker value={image} onChange={setImage} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., Spicy Chicken Curry"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 299"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ProductCategory)}
              disabled={isPending}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductCategory.food}>🍛 Food</SelectItem>
                <SelectItem value={ProductCategory.grocery}>🛒 Grocery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create Product'
              ) : (
                'Update Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
