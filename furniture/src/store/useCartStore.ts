import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.items.push({ ...product, quantity: 1 });
          }
        });
      },

      removeItem: (id) => {
        set((state) => {
          state.items = state.items.filter((item) => item.id !== id);
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            item.quantity = Math.max(0, quantity);
          }
          // Cleanup items with 0 quantity
          state.items = state.items.filter((item) => item.quantity > 0);
        });
      },

      clearCart: () => {
        set((state) => {
          state.items = [];
        });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    })),
    {
      name: "furniture-cart-storage",
    }
  )
);
