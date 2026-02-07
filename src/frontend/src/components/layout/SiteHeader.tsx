import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCartContext } from '@/components/cart/CartProvider';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getItemCount } = useCartContext();
  const itemCount = getItemCount();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'All Products', path: '/products' },
    { label: 'About Us', path: '/about' },
  ];

  const handleCartClick = () => {
    setMobileMenuOpen(false);
    navigate({ to: '/cart' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/assets/generated/dailykart-logo.dim_512x512.png"
              alt="DailyKart"
              className="h-10 w-10 rounded-lg object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-bold text-xl text-foreground hidden sm:inline-block">
              DailyKart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/admin/login' })}
            >
              Admin
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-border/40">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate({ to: '/admin/login' });
              }}
            >
              Admin
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
