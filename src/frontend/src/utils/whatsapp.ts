const WHATSAPP_NUMBER = '919897743469';

export function buildWhatsAppOrderUrl(productName: string, price: number): string {
  const message = `Hi! I would like to order:\n\n*${productName}*\nPrice: ₹${price}\n\nPlease confirm availability.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
