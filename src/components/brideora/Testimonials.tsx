import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya & Arjun",
    location: "Dwarka · Dec 2025",
    quote:
      "I found my dream artist in 10 minutes. The portfolio, pricing and reviews all in one place made the decision so easy.",
  },
  {
    name: "Neha S.",
    location: "Saket · Nov 2025",
    quote:
      "Brideora's concierge suggested artists that perfectly matched my pastel lehenga. The booking flow was effortless.",
  },
  {
    name: "Ritika & Karan",
    location: "Rohini · Feb 2026",
    quote:
      "Compared 4 artists side-by-side, booked the same evening, and never had to chase anyone. Worth every rupee.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="divider-ornament text-lg uppercase tracking-[0.3em]">Love Stories</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            Brides who said <span className="italic text-gradient-royal">"yes"</span> to Brideora
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-3xl bg-card p-8 border border-border shadow-soft relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold/40" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-5 font-serif text-lg leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="font-display text-lg text-primary">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
