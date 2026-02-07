import { ProductSummary } from '@/backend';
import ProductGrid from './ProductGrid';

interface CategorySectionProps {
  title: string;
  products: ProductSummary[];
  emptyMessage: string;
}

export default function CategorySection({
  title,
  products,
  emptyMessage,
}: CategorySectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary/20">
        {title}
      </h2>
      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
