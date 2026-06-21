import { Search, Sparkles, CalendarHeart, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    text: "Browse 850+ verified artists with portfolios, real reviews and transparent pricing.",
  },
  {
    icon: Sparkles,
    title: "Compare",
    text: "Use Brideora Concierge to instantly match artists to your budget, look, and locality.",
  },
  {
    icon: CalendarHeart,
    title: "Book",
    text: "Secure your date with instant confirmation, advance payments and reminders.",
  },
  {
    icon: PartyPopper,
    title: "Celebrate",
    text: "Show up radiant. We handle reminders, prep guidance and post-event support.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em]">The Process</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            From inspiration to <span className="italic text-gradient-royal">"I do"</span>
          </h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-3xl bg-card p-7 border border-border shadow-soft"
            >
              <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center font-display text-pearl text-lg shadow-gold">
                {i + 1}
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose flex items-center justify-center">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
