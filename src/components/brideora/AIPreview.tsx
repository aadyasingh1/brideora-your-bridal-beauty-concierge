import { Sparkles } from "lucide-react";

export function AIPreview() {
  return (
    <section id="ai" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-royal opacity-[0.97]" />
      <div className="absolute inset-0 bg-rose-glow opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center text-pearl max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-pearl/15 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-soft">
            <Sparkles className="h-3.5 w-3.5" /> Brideora Bridal Concierge
          </div>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Your personal <span className="italic text-gradient-gold">bridal beauty</span> advisor
          </h2>
          <p className="mt-5 text-pearl/80 text-lg font-serif">
            Describe your wedding, lehenga colour, budget and date — get a curated shortlist of artists, look ideas, and a complete beauty timeline in seconds.
          </p>
          <button
            onClick={() => {
              const button = document.querySelector('[data-ai-chat-trigger]') as HTMLButtonElement;
              if (button) button.click();
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-semibold text-foreground shadow-gold hover:shadow-luxe transition-all"
          >
            <Sparkles className="h-4 w-4" /> Try Brideora Concierge free
          </button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            { icon: "🎨", title: "AI Moodboard Matcher", desc: "Upload Pinterest/Instagram screenshots in chat to match with artists whose portfolios visually align with your style." },
            { icon: "⚡", title: "Automated Portfolio Tagging", desc: "For artists: AI face-analysis automatically generates descriptive tags for portfolio uploads, updating filters instantly." },
            { icon: "🎭", title: "Virtual 'Style Transfer' Preview", desc: "Upload a selfie in the booking modal to simulate how a specific artist's makeup look adapts to your facial skin tone." },
          ].map((feature, i) => (
            <div key={i} className="text-center text-pearl">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-display text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-pearl/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
