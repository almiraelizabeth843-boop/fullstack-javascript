import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link, useNavigate } from "react-router";
import { X, Instagram, Twitter, Facebook } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import type { Variants } from "framer-motion";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  navItems: { name: string, path: string, icon: LucideIcon }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, session, navItems }) => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { x: "100%", opacity: 0.5 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 300,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 300,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const itemVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
          />

          {/* Drawer */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-[320px] bg-background/95 backdrop-blur-2xl border-l border-border/40 z-[70] md:hidden flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Design elements */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-50">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/15 blur-[80px] rounded-full" />
              <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
            </div>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-border/20 relative z-10">
              <Link to="/" onClick={onClose} className="text-xl font-black italic tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LEONOR.
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-secondary transition-transform active:scale-90">
                <X size={20} />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-10 px-8 space-y-2 relative z-10 custom-scrollbar">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-6 opacity-60">Menu</p>
              {navItems.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-4 py-4 px-3 rounded-2xl transition-all duration-300",
                        isActive ? "bg-primary/10 text-primary shadow-sm" : "text-foreground/80 hover:bg-secondary/50 hover:text-primary"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={cn(
                          "p-2 rounded-xl transition-all duration-500",
                          isActive ? "bg-primary text-white scale-110 rotate-3 shadow-lg" : "bg-background border border-border/40 group-hover:scale-110"
                        )}>
                          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                          "text-xl font-bold tracking-tight",
                          isActive ? "scale-105" : ""
                        )}>
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* Footer / Account */}
            <div className="mt-auto border-t border-border/20 p-8 space-y-8 relative z-10 bg-secondary/10">
              {/* Account Section */}
              <div>
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-purple-600 p-[2px] shadow-xl">
                        <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center overflow-hidden">
                          {session.user.image ? (
                            <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-lg font-black text-transparent bg-gradient-to-br from-primary to-indigo-500 bg-clip-text">
                              {session.user.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold truncate text-foreground leading-none mb-1">{session.user.name}</span>
                        <span className="text-xs text-muted-foreground truncate font-medium">{session.user.email}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-2xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-bold h-12"
                      onClick={() => {
                        signOut();
                        onClose();
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full rounded-2xl h-14 font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-gradient-to-r from-primary to-indigo-600 border-none"
                    onClick={() => {
                      navigate("/login");
                      onClose();
                    }}
                  >
                    Join Leonor
                  </Button>
                )}
              </div>

              {/* Social & Contact */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  {[
                    { icon: Instagram, link: "#" },
                    { icon: Twitter, link: "#" },
                    { icon: Facebook, link: "#" }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.link} 
                      className="p-3 bg-background border border-border/40 rounded-xl hover:text-primary hover:border-primary/40 transition-all shadow-sm active:scale-90"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                    Est. 2026 <div className="h-1 w-1 rounded-full bg-primary/50" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
