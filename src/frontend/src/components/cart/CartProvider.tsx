import { createContext, useContext, ReactNode } from 'react';
import { useCart } from '@/hooks/cart/useCart';
import { CartState, CartActions } from '@/types/cart';

type CartContextType = CartState & CartActions;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
