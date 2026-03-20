import React from "react";
import { Star, ShoppingCart, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

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
  isFavorite: boolean;
}

interface ApiResponse {
  data: Product[];
  nextCursor: string | null;
}

const ProductList: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<ApiResponse>({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const response = await api.get<ApiResponse>("/products", {
        params: {
          limit: 8,
          cursor: pageParam,
        },
      });
      return response.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post("/favorites/toggle", { productId });
      return response.data;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((product: any) => 
              product.id === productId 
                ? { ...product, isFavorite: !product.isFavorite } 
                : product
            ),
          })),
        };
      });

      return { previousProducts };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(["products"], context?.previousProducts);
      toast.error("Failed to update favorite status. Please sign in.");
    },
    onSuccess: (data) => {
      toast.success(data.favorited ? "Added to favorites" : "Removed from favorites", {
        description: data.favorited ? "You can find it in your favorites page." : "Product removed from your list.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!session) {
      toast.error("Please sign in to favorite products", {
        description: "Your favorites are saved to your account.",
      });
      return;
    }
    toggleFavoriteMutation.mutate(productId);
  };

  const products = data?.pages.flatMap((page) => page.data) || [];

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
      image: product.images[0]?.url || "",
      discount: typeof product.discount === "string" ? parseFloat(product.discount) : product.discount,
    });
    toast.success(`${product.name} added to cart!`, {
      description: "You can find it in your shopping bag.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive font-medium">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Our Premium Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our curated selection of high-quality furniture designed to elevate your living space with style and comfort.
          </p>
        </div>
        <div className="flex gap-2">
           <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">All Units</span>
           <span className="px-4 py-2 hover:bg-secondary/50 transition-colors cursor-pointer text-muted-foreground rounded-full text-sm font-medium">Popular</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-in fade-in zoom-in duration-700">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={product.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {Number(product.discount) > 0 && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  {Number(product.discount)}% OFF
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => handleToggleFavorite(e, product.id)}
                  className={cn(
                    "bg-background/80 backdrop-blur-md rounded-full transition-all duration-300",
                    product.isFavorite ? "text-red-500 hover:text-red-600" : "text-foreground hover:text-red-500"
                  )}
                >
                  <Heart size={18} className={cn(product.isFavorite && "fill-current")} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleAddToCart(product)}
                  className="bg-background/80 backdrop-blur-md rounded-full text-foreground hover:bg-primary hover:text-white"
                >
                  <ShoppingCart size={18} />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {product.category?.name || "Uncategorized"} • {product.type?.name || "General"}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{(product.rating || 0).toFixed(1)}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-2xl font-black text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {Number(product.discount) > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${(Number(product.price) * (1 + Number(product.discount)/100)).toFixed(2)}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="group/btn">
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-16 flex justify-center">
          <Button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            size="lg"
            className="rounded-full px-12 py-6 text-lg font-semibold hover:scale-105 transition-transform"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Loading...
              </span>
            ) : "Load More Products"}
          </Button>
        </div>
      )}

      {!hasNextPage && products.length > 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground font-medium italic">
            ✨ You've reached the end of our premium collection.
          </p>
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-xl">No products found in our collection yet.</p>
        </div>
      )}
    </section>
  );
};

export default ProductList;
