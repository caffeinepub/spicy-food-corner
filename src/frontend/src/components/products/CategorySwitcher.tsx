import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCategory } from '@/backend';

interface CategorySwitcherProps {
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export default function CategorySwitcher({
  selectedCategory,
  onCategoryChange,
}: CategorySwitcherProps) {
  return (
    <div className="flex justify-center mb-8">
      <Tabs value={selectedCategory} onValueChange={(v) => onCategoryChange(v as ProductCategory | 'all')}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={ProductCategory.food}>🍛 Food</TabsTrigger>
          <TabsTrigger value={ProductCategory.grocery}>🛒 Grocery</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
