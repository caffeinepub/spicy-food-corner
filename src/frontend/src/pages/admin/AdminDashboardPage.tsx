import { useState } from 'react';
import { useProducts } from '@/hooks/products/useProducts';
import ProductTable from '@/components/admin/ProductTable';
import ProductEditorDialog from '@/components/admin/ProductEditorDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useAdminLogout } from '@/hooks/admin/useAdminSession';
import { useNavigate } from '@tanstack/react-router';

export default function AdminDashboardPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts();
  const { mutate: logout } = useAdminLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate({ to: '/admin/login' });
      },
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your products and inventory
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
            <Button onClick={handleLogout} variant="outline" size="lg">
              Logout
            </Button>
          </div>
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
          <ProductTable products={products || []} />
        )}

        <ProductEditorDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode="create"
        />
      </div>
    </div>
  );
}
