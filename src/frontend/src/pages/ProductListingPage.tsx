import { useProducts } from '@/hooks/products/useProducts';
import CategorySection from '@/components/products/CategorySection';
import { ProductCategory } from '@/backend';
import { Loader2 } from 'lucide-react';

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

        {error && (
          <div className="text-center py-16">
            <p className="text-destructive">Failed to load products. Please try again.</p>
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
