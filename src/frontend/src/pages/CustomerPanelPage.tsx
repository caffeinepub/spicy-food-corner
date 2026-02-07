import { useState } from 'react';
import BrandingHero from '@/components/branding/BrandingHero';
import CategorySwitcher from '@/components/products/CategorySwitcher';
import ProductGrid from '@/components/products/ProductGrid';
import HomeRksContactBlock from '@/components/branding/HomeRksContactBlock';
import { useProducts } from '@/hooks/products/useProducts';
import { ProductCategory } from '@/backend';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CustomerPanelPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const { data: products, isLoading, error } = useProducts();

  const filteredProducts =
    selectedCategory === 'all'
      ? products || []
      : (products || []).filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <BrandingHero />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg">
            Browse our delicious selection and order directly on WhatsApp
          </p>
        </div>

        <CategorySwitcher
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex justify-center items-center py-16">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load products. Please refresh the page or try again later.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No products available in this category yet.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <ProductGrid products={filteredProducts} />
        )}
      </section>

      <HomeRksContactBlock />
    </div>
  );
}
