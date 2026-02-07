import { useState, useEffect } from 'react';
import { CartItem, CartState, CartActions } from '@/types/cart';

const CART_STORAGE_KEY = 'spicy-food-corner-cart';

function loadCartFromStorage(): CartState {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return { items: [] };
}

function saveCartToStorage(state: CartState): void {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function useCart(): CartState & CartActions {
  const [state, setState] = useState<CartState>(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setState((prev) => {
      const existingItem = prev.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...prev.items, { ...item, quantity: 1 }],
      };
    });
  };

  const removeItem = (id: string) => {
    setState((prev) => ({
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setState((prev) => ({
      items: prev.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    }));
  };

  const incrementQuantity = (id: string) => {
    setState((prev) => ({
      items: prev.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  };

  const decrementQuantity = (id: string) => {
    setState((prev) => ({
      items: prev.items.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      ),
    }));
  };

  const clearCart = () => {
    setState({ items: [] });
  };

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
  };
}
