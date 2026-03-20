import { Navbar, Hero } from "@/components/LandingPage";
import ProductList from "@/components/ProductList";
import { MoveRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Premium Materials", desc: "Sourced sustainably from around the globe for unmatched durability.", icon: "💎" },
              { title: "Expert Craftsmanship", desc: "Every piece is hand-finished by master artisans with decades of experience.", icon: "🛠️" },
              { title: "Modern Ergonomics", desc: "Designed for the human body, balancing aesthetics with absolute comfort.", icon: "🧘" }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ProductList />

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto rounded-[3rem] bg-indigo-600 p-12 lg:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/20 skew-x-12 translate-x-20 transition-transform group-hover:translate-x-10 duration-1000"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Ready to transform your home?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                Join 50,000+ happy customers who have already upgraded their living standards. Get free expert consultation today.
              </p>
              <Button className="px-12 py-8 bg-white text-indigo-600 rounded-full text-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2 group h-auto">
                Begin Transformation <MoveRight className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black italic mb-6 block hover:opacity-80 transition-opacity">LEONOR.</Link>
            <p className="text-muted-foreground mb-8">Crafting atmospheres since 2012. We believe your home should be your greatest masterpiece.</p>
            <div className="flex gap-4">
               <Link to="/" className="p-2 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300"><Instagram size={20} /></Link>
               <Link to="/" className="p-2 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300"><Twitter size={20} /></Link>
               <Link to="/" className="p-2 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300"><Facebook size={20} /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground">Navigation</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link></li>
              <li><Link to="/designers" className="hover:text-primary transition-colors">Designers</Link></li>
              <li><Link to="/showrooms" className="hover:text-primary transition-colors">Showrooms</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold mb-6 text-foreground">Support</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/care-guide" className="hover:text-primary transition-colors">Care Guide</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground">Newsletter</h4>
            <p className="text-muted-foreground mb-6">Stay updated with our latest architectural releases.</p>
            <div className="flex bg-secondary p-1 rounded-full border border-border items-center focus-within:border-primary/50 transition-all group">
              <Input type="email" placeholder="Email" className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm h-10 ring-0 focus-visible:ring-0 " />
              <Button className="bg-primary text-white rounded-full px-6 py-2 text-sm font-bold h-10 hover:text-black hover:bg-black/20 transition-all duration-100">Join</Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <p>© 2026 LEONOR DESIGN CO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

