import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem, FoodItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (food: FoodItem) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((food: FoodItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.food.id === food.id);
      if (existing) return prev.map(i => i.food.id === food.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { food, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((foodId: string) => {
    setItems(prev => prev.filter(i => i.food.id !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.food.id !== foodId));
    } else {
      setItems(prev => prev.map(i => i.food.id === foodId ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
