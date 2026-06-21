import { Sparkles, Send } from "lucide-react";

const chips = [
  "Under ₹15k in Dwarka",
  "HD makeup for reception",
  "Mehendi artist next Saturday",
  "Pastel bridal look",
];

export function AIPreview() {
  return (
    <section id="ai" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-royal opacity-[0.97]" />
      <div className="absolute inset-0 bg-rose-glow opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-pearl">
          <div className="inline-flex items-center gap-2 rounded-full bg-pearl/15 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-soft">
            <Sparkles className="h-3.5 w-3.5" /> Brideora AI Concierge
          </div>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Your personal <span className="italic text-gradient-gold">bridal beauty</span> advisor
          </h2>
          <p className="mt-5 text-pearl/80 text-lg font-serif max-w-lg">
            Describe your wedding, lehenga colour, budget and date — get a
            curated shortlist of artists, look ideas, and a complete beauty
            timeline in seconds.
          </p>
          <a
            href="#ai-chat"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-semibold text-foreground shadow-gold hover:shadow-luxe transition-all"
          >
            <Sparkles className="h-4 w-4" /> Try Brideora AI free
          </a>
        </div>

        <div className="rounded-[2rem] bg-pearl p-2 shadow-luxe">
          <div className="rounded-[1.6rem] bg-ivory p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-pearl" />
              </div>
              <div>
                <div className="font-display text-base text-primary">Brideora AI</div>
                <div className="text-[11px] text-muted-foreground">Live · responds instantly</div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-royal px-4 py-3 text-sm text-pearl">
                I'm getting married in March in Dwarka. Budget ₹15,000 for HD makeup.
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-pearl border border-border px-4 py-3 text-sm text-foreground">
                Lovely! I found <strong>14 artists</strong> in Dwarka under ₹15k with March availability. Here are the top 3 matches with 4.8+ ratings…
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    className="rounded-full border border-gold/50 bg-pearl px-3 py-1.5 text-xs text-primary hover:bg-rose transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-pearl px-4 py-2.5">
              <input
                placeholder="Ask anything about your bridal look…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button className="h-8 w-8 rounded-full bg-gradient-royal flex items-center justify-center text-pearl">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
