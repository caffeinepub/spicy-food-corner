import { useProducts } from '@/hooks/products/useProducts';
import CategorySection from '@/components/products/CategorySection';
import { ProductCategory } from '@/backend';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProductListingPage() {
  const { data: products, isLoading, error } = useProducts();

  const foodProducts = (products || []).filter((p) => p.category === ProductCategory.food);
  const groceryProducts = (products || []).filter((p) => p.category === ProductCategory.grocery);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Complete Product Listing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse all our products organized by category
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex justify-center items-center py-16">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load products. Please refresh the page or try again later.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-16">
            <CategorySection
              title="Food"
              products={foodProducts}
              emptyMessage="No food items available yet."
            />
            <CategorySection
              title="Grocery"
              products={groceryProducts}
              emptyMessage="No grocery items available yet."
            />
          </div>
        )}
      </div>
    </div>
  );
}
