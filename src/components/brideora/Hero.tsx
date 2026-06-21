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
    onSearch();
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

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-pearl p-2 shadow-luxe">
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
              <label className="flex items-center gap-2 rounded-xl px-4 py-3 hover:bg-ivory transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Locality</div>
                  <input
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="Dwarka, Saket, Rohini…"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </label>
              <label className="flex items-center gap-2 rounded-xl px-4 py-3 hover:bg-ivory transition-colors sm:border-l border-border">
                <IndianRupee className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</div>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none cursor-pointer"
                  >
                    <option value="Any budget">Any budget</option>
                    <option value="Under ₹10,000">Under ₹10,000</option>
                    <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                    <option value="₹20,000+">₹20,000+</option>
                  </select>
                </div>
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-royal px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Find Artists
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
