import { Product, ProductCategory } from '@/backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildWhatsAppOrderUrl } from '@/utils/whatsapp';
import { SiWhatsapp } from 'react-icons/si';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product.image.getDirectURL();
  const priceInRupees = Number(product.price);

  const handleOrderClick = () => {
    const url = buildWhatsAppOrderUrl(product.name, priceInRupees);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageError ? '/assets/placeholder-product.svg' : imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <Badge
          className="absolute top-3 right-3"
          variant={product.category === ProductCategory.food ? 'default' : 'secondary'}
        >
          {product.category === ProductCategory.food ? '🍛 Food' : '🛒 Grocery'}
        </Badge>
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-primary">
          ₹{priceInRupees}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleOrderClick}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
          size="lg"
        >
          <SiWhatsapp className="mr-2 h-5 w-5" />
          Order on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
