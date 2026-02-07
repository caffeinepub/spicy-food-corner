import { CartItem } from '@/types/cart';

const WHATSAPP_NUMBER = '919897743469';

export function buildWhatsAppOrderUrl(productName: string, price: number): string {
  const message = `Hi! I would like to order:\n\n*${productName}*\nPrice: ₹${price}\n\nPlease confirm availability.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

interface OrderFormData {
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
}

export function buildWhatsAppCartOrderUrl(
  customerDetails: OrderFormData,
  cartItems: CartItem[]
): string {
  const itemsList = cartItems
    .map((item) => `• *${item.name}* - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = `🛒 *New Order Request*\n\n` +
    `*Customer Details:*\n` +
    `Name: ${customerDetails.customerName}\n` +
    `Mobile: ${customerDetails.mobileNumber}\n` +
    `Address: ${customerDetails.deliveryAddress}\n\n` +
    `*Order Items:*\n${itemsList}\n\n` +
    `*Total Amount: ₹${total}*\n\n` +
    `Please confirm this order. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
