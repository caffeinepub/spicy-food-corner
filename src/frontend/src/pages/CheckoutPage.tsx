import { useState } from 'react';
import { useCartContext } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { buildWhatsAppCartOrderUrl } from '@/utils/whatsapp';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrderFormData {
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
}

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    mobileNumber: '',
    deliveryAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('Please enter your mobile number');
      return false;
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const whatsappUrl = buildWhatsAppCartOrderUrl(formData, items);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      toast.success('WhatsApp opened! Please send the message to confirm your order.', {
        duration: 5000,
      });

      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        navigate({ to: '/' });
        toast.info('Your cart has been cleared. Thank you for your order!');
      }, 2000);
    } catch (error) {
      toast.error('Failed to open WhatsApp. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      Customer Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">
                      Delivery Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      placeholder="Enter your complete delivery address"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-muted-foreground">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground ml-2">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>₹{subtotal}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order via WhatsApp'
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to WhatsApp to confirm your order
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
