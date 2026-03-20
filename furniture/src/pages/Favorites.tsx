import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Heart, ShoppingCart, ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  discount: string | number;
  rating: number;
  images: { url: string }[];
  category: { name: string };
  type: { name: string };
}

interface Favorite {
  id: string;
  product: Product;
}

const FavoritesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  const { data: favorites, isLoading } = useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.get("/favorites");
      return response.data;
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post("/favorites/toggle", { productId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Removed from favorites");
    },
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0]?.url || "",
      discount: Number(product.discount),
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Catalog
            </Link>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              Your Favorites
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your curated collection of premium furniture pieces.
            </p>
          </div>
          <div className="flex bg-secondary/50 backdrop-blur-md rounded-2xl p-4 items-center gap-4 border border-border/50">
             <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Heart size={24} className="fill-current" />
             </div>
             <div>
                <p className="text-sm font-bold text-foreground">{favorites?.length || 0} Items</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Saved to Account</p>
             </div>
          </div>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={fav.product.images[0]?.url}
                      alt={fav.product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleFavoriteMutation.mutate(fav.product.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                        {fav.product.category?.name} • {fav.product.type?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors truncate">
                      {fav.product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-foreground">
                          ${Number(fav.product.price).toFixed(2)}
                        </span>
                        {Number(fav.product.discount) > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${(Number(fav.product.price) * (1 + Number(fav.product.discount)/100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleAddToCart(fav.product)}
                        className="rounded-2xl px-6 py-6 h-auto font-bold flex gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        <ShoppingCart size={20} />
                        Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-secondary/50 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
               <ShoppingBag size={48} className="text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-black mb-4">Your collection is empty</h2>
            <p className="text-muted-foreground text-lg max-w-sm mb-12">
              Start adding your favorite pieces to create your dream home collection.
            </p>
            <Link to="/">
               <Button size="lg" className="rounded-full px-12 py-8 text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Browse Catalog
               </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
