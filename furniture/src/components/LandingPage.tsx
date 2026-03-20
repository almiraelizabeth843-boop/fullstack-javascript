import React from "react";
import { Search, ShoppingBag, Menu, Heart, Home, Info, Mail } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, NavLink, Link } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "./CartDrawer";
import { MobileNav } from "./MobileNav";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.get("/favorites");
      return response.data;
    },
    enabled: !!session,
  });

  const favoritesCount = favorites?.length || 0;

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: ShoppingBag },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent italic hover:opacity-80 transition-opacity">
              LEONOR.
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                      isActive 
                        ? "text-primary after:w-full" 
                        : "text-foreground/70 hover:text-primary after:w-0 hover:after:w-full"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Desktop-only Search */}
            <div className="hidden lg:flex items-center bg-secondary/50 rounded-full px-4 border border-border/50 focus-within:border-primary/50 transition-all group">
              <Search size={18} className="text-muted-foreground mr-2 group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                placeholder="Search furniture..." 
                className="bg-transparent border-none outline-none text-sm w-40 lg:w-60 h-10 ring-0 focus-visible:ring-0"
              />
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/favorites")}
                className="rounded-full relative group"
              >
                <Heart size={20} className={cn("group-hover:text-red-500 transition-colors", favoritesCount > 0 && "fill-red-500 text-red-500")} />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full text-white font-bold group-hover:scale-110 transition-transform">
                    {favoritesCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(true)}
                className="rounded-full relative group"
              >
                <ShoppingBag size={20} className="group-hover:text-primary transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-bold group-hover:scale-110 transition-transform">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {session ? (
                <div className="flex items-center gap-2 ml-1 border-l pl-3 border-border">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background ring-offset-1 ring-border shadow-lg flex-shrink-0">
                    {session.user.name.charAt(0)}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden sm:flex text-xs font-bold tracking-tighter hover:text-destructive transition-colors">Sign Out</Button>
                </div>
              ) : (
                <Button size="sm" className="hidden sm:flex rounded-full px-5 font-bold hover:scale-105 transition-transform" onClick={() => navigate("/login")}>Sign In</Button>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden rounded-full transition-all active:scale-90 flex-shrink-0"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={20} className="text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <MobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        session={session} 
        navItems={navItems} 
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></div>
            Spring Signature Collection 2026
          </div>
          <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight mb-8">
            Redefine Your <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Sanctuary.
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-lg mb-10 leading-relaxed">
            Experience the fusion of contemporary art and functional design. Our furniture isn't just wood and fabric—it's a lifestyle statement.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-white/10 border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Explore Collection
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold border-white/20 text-black hover:bg-white/10 transition-all duration-300 hover:text-white">
              View Showroom
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-6 text-white/60">
            <div>
              <div className="text-2xl font-bold text-white">12k+</div>
              <div className="text-xs uppercase tracking-widest">Items Sold</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div>
              <div className="text-2xl font-bold text-white">4.9/5</div>
              <div className="text-xs uppercase tracking-widest">Satisfied Users</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div>
              <div className="text-2xl font-bold text-white">24hr</div>
              <div className="text-xs uppercase tracking-widest">Global Shipping</div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative z-10 rounded-3xl overflow-hidden glass shadow-2xl border border-white/10 group">
             <img 
               src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" 
               alt="Hero Furniture" 
               className="w-full aspect-[4/5] object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white font-bold text-xl mb-1">Architectural Armchair</p>
                <p className="text-white/60 text-sm italic">Designed by Elias Vane, 2025</p>
             </div>
          </div>          
        </div>
      </div>
      
    </div>
  );
};
