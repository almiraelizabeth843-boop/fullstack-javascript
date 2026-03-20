import React from "react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  const subtotal = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background/95 backdrop-blur-3xl border-l border-border/50 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Shopping Cart ({getTotalItems()})</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-secondary">
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground max-w-[200px] mb-8">
                    Looks like you haven't added any premium pieces to your collection yet.
                  </p>
                  <Button onClick={onClose} variant="outline" className="rounded-full px-8">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-base truncate pr-4">{item.name}</h4>
                          <span className="font-black text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Premium Furniture</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-secondary/80 rounded-full p-1 border border-border/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold leading-none">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-secondary/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-bold">Free</span>
                  </div>
                  <div className="pt-2 border-t border-border/20 flex justify-between items-end">
                    <span className="text-base font-bold">Order Total</span>
                    <span className="text-2xl font-black text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Secure Checkout
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter">
                  Free global shipping on all premium collections • Secure SSL Encryption
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
