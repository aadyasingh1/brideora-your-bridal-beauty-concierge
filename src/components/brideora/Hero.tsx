import { Search, MapPin, IndianRupee, Sparkles, Star } from "lucide-react";
import heroImage from "@/assets/hero-bride.jpg";

interface HeroProps {
  locality: string;
  setLocality: (val: string) => void;
  budget: string;
  setBudget: (val: string) => void;
  onSearch: () => void;
}

export function Hero({ locality, setLocality, budget, setBudget, onSearch }: HeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locality.trim()) return;
    window.dispatchEvent(
      new CustomEvent("open-concierge", {
        detail: { query: locality }
      })
    );
  };

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-ivory">
      <div className="absolute inset-0 bg-rose-glow opacity-70 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-pearl/60 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            India's Bridal Beauty Marketplace
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            Find Your Perfect
            <br />
            <span className="text-gradient-royal italic">Bridal Beauty</span>
            <br />
            Expert in Delhi
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground font-serif">
            Compare portfolios, pricing, and reviews of trusted bridal makeup
            artists, mehendi designers and stylists — and book in under five
            minutes.
          </p>

          {/* Conversational AI Search */}
          <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] border border-gold/20 bg-pearl p-2.5 shadow-luxe">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex-1 w-full flex items-center gap-3 px-4 py-2 hover:bg-ivory/50 rounded-2xl transition-colors cursor-text">
                <Sparkles className="h-5 w-5 text-primary animate-pulse shrink-0" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Brideora AI Search</div>
                  <input
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="Describe your wedding look, budget, or area (e.g. 'day wedding, minimal look in Dwarka under 20k')"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                </div>
              </label>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-royal px-6 py-4 text-xs font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider"
              >
                <Search className="h-4 w-4" />
                Ask Concierge
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-pearl bg-gradient-gold"
                  />
                ))}
              </div>
              <span><strong className="text-foreground">2,400+</strong> brides served</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span><strong className="text-foreground">4.9</strong> average rating</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe ring-1 ring-gold/30">
            <img
              src={heroImage}
              alt="Indian bride in traditional red lehenga with gold jewelry"
              className="h-full w-full object-cover"
              width={1080}
              height={1350}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent h-1/3" />
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 -left-4 sm:-left-10 max-w-[18rem] rounded-2xl bg-pearl p-4 shadow-luxe border border-gold/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-pearl" />
              </div>
              <div>
                <div className="font-display text-base text-primary">Brideora Concierge</div>
                <div className="text-xs text-muted-foreground">
                  "Find me an artist under ₹15k in Dwarka"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
